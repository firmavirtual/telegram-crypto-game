const TelegramBot = require('node-telegram-bot-api');
const db = require('./database');

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:3000';

// Create bot instance
let bot;
try {
    bot = new TelegramBot(token, { polling: true });
    console.log('Bot initialized successfully');
} catch (error) {
    console.error('Error initializing bot:', error);
    process.exit(1);
}

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception:', error);
});

// Bot error handlers
bot.on('polling_error', (error) => {
    console.log('Polling error:', error.code, error.message);
});

bot.on('error', (error) => {
    console.log('Bot error:', error);
});

// Generate random referral code
function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Start command
bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const username = msg.from.username || '';
    const firstName = msg.from.first_name || '';
    const lastName = msg.from.last_name || '';
    const referralCode = match[1] ? match[1].trim() : '';

    console.log(`/start command from ${telegramId}`);

    // Check if user exists
    db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            bot.sendMessage(chatId, '❌ Error. Please try again.');
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
                        console.error('Error creating user:', err);
                        bot.sendMessage(chatId, '❌ Error creating account. Please try again.');
                        return;
                    }

                    console.log(`New user created: ${telegramId}`);

                    // If referred by someone
                    if (referralCode) {
                        db.get('SELECT id FROM users WHERE referral_code = ?', [referralCode], (err, referrer) => {
                            if (!err && referrer) {
                                const newUserId = this.lastID;
                                db.run(
                                    'INSERT INTO referrals (referrer_id, referred_id, points_earned) VALUES (?, ?, ?)',
                                    [referrer.id, newUserId, 100]
                                );
                                db.run('UPDATE users SET points = points + 100 WHERE id = ?', [referrer.id]);
                                console.log(`Referral bonus awarded to user ${referrer.id}`);
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
});

// Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `
🎮 *Crypto Mini Game Bot*

*Commands:*
/start - Start the game
/play - Open mini game
/profile - View your profile
/help - Show this message

*How to Play:*
• Complete missions
• Earn points
• Invite friends
• Qualify for airdrop

Good luck! 🚀
    `;

    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// Play command
bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '🎮 Click the button below to play!', {
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

        db.get('SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?', [user.id], (err, result) => {
            const referralCount = result ? result.count : 0;

            const profileText = `
👤 *Your Profile*

🆔 Username: @${user.username || 'Not set'}
💰 Points: ${user.points}
👥 Referrals: ${referralCount}
💳 Wallet: ${user.wallet_address || 'Not set'}
🔗 Code: \`${user.referral_code}\`

Use /play to open the game!
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

    if (walletAddress.length < 20) {
        bot.sendMessage(chatId, '❌ Invalid wallet address.');
        return;
    }

    db.run('UPDATE users SET wallet_address = ? WHERE telegram_id = ?', [walletAddress, telegramId], (err) => {
        if (err) {
            bot.sendMessage(chatId, '❌ Error updating wallet.');
            return;
        }
        bot.sendMessage(chatId, '✅ Wallet updated successfully!');
    });
});

// Send welcome message
function sendWelcomeMessage(chatId, firstName, referralCode) {
    const welcomeText = `
🎉 *Welcome ${firstName}!*

You've joined the Crypto Mini Game!

🎮 Complete missions
🏆 Earn points
👥 Invite friends
💰 Qualify for airdrop

Your referral code: \`${referralCode}\`

Click below to start playing!
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

console.log('Bot is running...');

module.exports = bot;
