const TelegramBot = require('node-telegram-bot-api');
const db = require('./database');
const { generateReferralCode, isSpamming, logActivity } = require('./utils/helpers');

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:3000';

// Global error handlers to prevent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't crash the application
});

process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception:', error);
    // Don't crash the application
});

const bot = new TelegramBot(token, { polling: true });

// Error handling for polling
bot.on('polling_error', (error) => {
    console.log('Polling error:', error.code);
    if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
        console.log('⚠️ Another bot instance is running. Stopping polling...');
        bot.stopPolling();
    }
});

bot.on('error', (error) => {
    console.log('Bot error:', error);
});

// Start command
bot.onText(/\/start(.*)/, async (msg, match) => {
    try {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id.toString();
        const username = msg.from.username || '';
        const firstName = msg.from.first_name || '';
        const lastName = msg.from.last_name || '';
        const referralCode = match[1].trim();

        // Anti-spam check
        if (await isSpamming(telegramId, 'start')) {
            bot.sendMessage(chatId, '⚠️ Please wait a moment before trying again.');
            return;
        }

        await logActivity(telegramId, 'start');

        // Check if user exists
        db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId], async (err, user) => {
            if (err) {
                console.error(err);
                return;
            }

            if (!user) {
                // Create new user
                const newReferralCode = generateReferralCode();

                db.run(
                    `INSERT INTO users (telegram_id, username, first_name, last_name, referral_code, referred_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                    [telegramId, username, firstName, lastName, newReferralCode, referralCode || null],
                    function (err) {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        // If referred by someone, add referral record
                        if (referralCode) {
                            db.get('SELECT id FROM users WHERE referral_code = ?', [referralCode], (err, referrer) => {
                                if (referrer) {
                                    db.run(
                                        'INSERT INTO referrals (referrer_id, referred_id, points_earned) VALUES (?, ?, ?)',
                                        [referrer.id, this.lastID, 100]
                                    );
                                    // Award points to referrer
                                    db.run('UPDATE users SET points = points + 100 WHERE id = ?', [referrer.id]);
                                }
                            });
                        }

                        sendWelcomeMessage(chatId, firstName, newReferralCode);
                    }
                );
            } else {
                // Update last active
                db.run('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE telegram_id = ?', [telegramId]);
                sendWelcomeMessage(chatId, firstName, user.referral_code);
            }
        });
    } catch (error) {
        console.error('Error in /start command:', error);
    }
});

// Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `
🎮 *Welcome to Crypto Mini Game!*

*Available Commands:*
/start - Start the game
/play - Open the mini game
/profile - View your profile
/missions - View available missions
/leaderboard - View top players
/referral - Get your referral link
/wallet - Set your wallet address
/help - Show this help message

*How to Play:*
1. Complete daily and weekly missions
2. Earn points and climb the leaderboard
3. Invite friends using your referral link
4. Link your social media accounts
5. Qualify for the airdrop!

Good luck! 🚀
  `;

    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// Play command - opens the mini game
bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '🎮 Click the button below to open the game!', {
        reply_markup: {
            inline_keyboard: [[
                { text: '🚀 Play Game', web_app: { url: webAppUrl } }
            ]]
        }
    });
});

// Profile command
bot.onText(/\/profile/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err || !user) {
            bot.sendMessage(chatId, '❌ User not found. Please use /start first.');
            return;
        }

        // Get referral count
        db.get('SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?', [user.id], (err, result) => {
            const referralCount = result ? result.count : 0;

            const profileText = `
👤 *Your Profile*

🆔 Username: @${user.username || 'Not set'}
💰 Points: ${user.points}
👥 Referrals: ${referralCount}
💳 Wallet: ${user.wallet_address || 'Not set'}
🔗 Referral Code: \`${user.referral_code}\`

Use /wallet to set your wallet address
Use /referral to get your referral link
      `;

            bot.sendMessage(chatId, profileText, { parse_mode: 'Markdown' });
        });
    });
});

// Wallet command
bot.onText(/\/wallet (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const walletAddress = match[1].trim();

    // Basic validation (you can add more sophisticated validation)
    if (walletAddress.length < 20) {
        bot.sendMessage(chatId, '❌ Invalid wallet address. Please provide a valid address.');
        return;
    }

    db.run('UPDATE users SET wallet_address = ? WHERE telegram_id = ?', [walletAddress, telegramId], (err) => {
        if (err) {
            bot.sendMessage(chatId, '❌ Error updating wallet address.');
            return;
        }

        bot.sendMessage(chatId, '✅ Wallet address updated successfully!');
    });
});

// Referral command
bot.onText(/\/referral/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    db.get('SELECT referral_code FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err || !user) {
            bot.sendMessage(chatId, '❌ User not found. Please use /start first.');
            return;
        }

        const botUsername = bot.options.username || 'YourBotUsername';
        const referralLink = `https://t.me/${botUsername}?start=${user.referral_code}`;

        const referralText = `
🎁 *Your Referral Link*

Share this link with your friends:
${referralLink}

Earn 100 points for each friend who joins!
    `;

        bot.sendMessage(chatId, referralText, { parse_mode: 'Markdown' });
    });
});

// Leaderboard command
bot.onText(/\/leaderboard/, (msg) => {
    const chatId = msg.chat.id;

    db.all(
        `SELECT u.username, u.first_name, u.points 
     FROM users u 
     WHERE u.is_banned = 0 
     ORDER BY u.points DESC 
     LIMIT 10`,
        [],
        (err, rows) => {
            if (err) {
                bot.sendMessage(chatId, '❌ Error fetching leaderboard.');
                return;
            }

            let leaderboardText = '🏆 *Top 10 Players*\n\n';

            rows.forEach((row, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                const name = row.username ? `@${row.username}` : row.first_name;
                leaderboardText += `${medal} ${name} - ${row.points} points\n`;
            });

            bot.sendMessage(chatId, leaderboardText, { parse_mode: 'Markdown' });
        }
    );
});

// Missions command
bot.onText(/\/missions/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '📋 Click the button below to view and complete missions!', {
        reply_markup: {
            inline_keyboard: [[
                { text: '📋 View Missions', web_app: { url: `${webAppUrl}#missions` } }
            ]]
        }
    });
});

function sendWelcomeMessage(chatId, firstName, referralCode) {
    const welcomeText = `
🎉 *Welcome ${firstName}!*

You've successfully joined our Crypto Mini Game!

🎮 Complete missions to earn points
🏆 Climb the leaderboard
👥 Invite friends and earn rewards
💰 Qualify for the airdrop

Your referral code: \`${referralCode}\`

Click the button below to start playing!
  `;

    bot.sendMessage(chatId, welcomeText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: '🚀 Play Now', web_app: { url: webAppUrl } }
            ]]
        }
    });
}

// Export bot for use in other modules
module.exports = bot;
