const TelegramBot = require('node-telegram-bot-api');
const db = require('./database-mysql');
const { generateReferralCode, isSpamming, logActivity } = require('./utils/helpers-mysql');

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:3000';

// Webhook mode para shared hosting
const bot = new TelegramBot(token);

// Configurar webhook
async function setWebhook() {
    const webhookUrl = `${webAppUrl}/webhook/${token}`;
    try {
        await bot.setWebHook(webhookUrl);
        console.log(`✅ Webhook configurado: ${webhookUrl}`);
    } catch (error) {
        console.error('❌ Error configurando webhook:', error);
    }
}

// Procesar actualizaciones del webhook
async function processUpdate(update) {
    if (update.message) {
        await handleMessage(update.message);
    } else if (update.callback_query) {
        await handleCallbackQuery(update.callback_query);
    }
}

// Manejar mensajes
async function handleMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    if (text.startsWith('/start')) {
        await handleStart(msg);
    } else if (text === '/help') {
        await handleHelp(msg);
    } else if (text === '/play') {
        await handlePlay(msg);
    } else if (text === '/profile') {
        await handleProfile(msg);
    } else if (text.startsWith('/wallet')) {
        await handleWallet(msg);
    } else if (text === '/referral') {
        await handleReferral(msg);
    } else if (text === '/leaderboard') {
        await handleLeaderboard(msg);
    } else if (text === '/missions') {
        await handleMissions(msg);
    }
}

// Handler: /start
async function handleStart(msg) {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const username = msg.from.username || '';
    const firstName = msg.from.first_name || '';
    const lastName = msg.from.last_name || '';

    const match = msg.text.match(/\/start\s+(.+)/);
    const referralCode = match ? match[1] : null;

    // Anti-spam check
    if (await isSpamming(telegramId, 'start')) {
        await bot.sendMessage(chatId, '⚠️ Please wait a moment before trying again.');
        return;
    }

    await logActivity(telegramId, 'start');

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);

    if (users.length === 0) {
        // Create new user
        const newReferralCode = generateReferralCode();

        await db.query(
            `INSERT INTO users (telegram_id, username, first_name, last_name, referral_code, referred_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [telegramId, username, firstName, lastName, newReferralCode, referralCode || null]
        );

        // If referred by someone
        if (referralCode) {
            const [referrer] = await db.query('SELECT id FROM users WHERE referral_code = ?', [referralCode]);
            if (referrer.length > 0) {
                const [result] = await db.query('SELECT id FROM users WHERE telegram_id = ?', [telegramId]);
                await db.query(
                    'INSERT INTO referrals (referrer_id, referred_id, points_earned) VALUES (?, ?, ?)',
                    [referrer[0].id, result[0].id, 100]
                );
                await db.query('UPDATE users SET points = points + 100 WHERE id = ?', [referrer[0].id]);
            }
        }

        await sendWelcomeMessage(chatId, firstName, newReferralCode);
    } else {
        await db.query('UPDATE users SET last_active = NOW() WHERE telegram_id = ?', [telegramId]);
        await sendWelcomeMessage(chatId, firstName, users[0].referral_code);
    }
}

// Handler: /help
async function handleHelp(msg) {
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

    await bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
}

// Handler: /play
async function handlePlay(msg) {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, '🎮 Click the button below to open the game!', {
        reply_markup: {
            inline_keyboard: [[
                { text: '🚀 Play Game', web_app: { url: webAppUrl } }
            ]]
        }
    });
}

// Handler: /profile
async function handleProfile(msg) {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const [users] = await db.query('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);

    if (users.length === 0) {
        await bot.sendMessage(chatId, '❌ User not found. Please use /start first.');
        return;
    }

    const user = users[0];
    const [referrals] = await db.query('SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?', [user.id]);
    const referralCount = referrals[0].count;

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

    await bot.sendMessage(chatId, profileText, { parse_mode: 'Markdown' });
}

// Handler: /wallet
async function handleWallet(msg) {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const match = msg.text.match(/\/wallet\s+(.+)/);

    if (!match) {
        await bot.sendMessage(chatId, '💳 To set your wallet address, use:\n/wallet YOUR_WALLET_ADDRESS');
        return;
    }

    const walletAddress = match[1].trim();

    if (walletAddress.length < 20) {
        await bot.sendMessage(chatId, '❌ Invalid wallet address. Please provide a valid address.');
        return;
    }

    await db.query('UPDATE users SET wallet_address = ? WHERE telegram_id = ?', [walletAddress, telegramId]);
    await bot.sendMessage(chatId, '✅ Wallet address updated successfully!');
}

// Handler: /referral
async function handleReferral(msg) {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const [users] = await db.query('SELECT referral_code FROM users WHERE telegram_id = ?', [telegramId]);

    if (users.length === 0) {
        await bot.sendMessage(chatId, '❌ User not found. Please use /start first.');
        return;
    }

    const botUsername = process.env.BOT_USERNAME || 'YourBotUsername';
    const referralLink = `https://t.me/${botUsername}?start=${users[0].referral_code}`;

    const referralText = `
🎁 *Your Referral Link*

Share this link with your friends:
${referralLink}

Earn 100 points for each friend who joins!
  `;

    await bot.sendMessage(chatId, referralText, { parse_mode: 'Markdown' });
}

// Handler: /leaderboard
async function handleLeaderboard(msg) {
    const chatId = msg.chat.id;

    const [users] = await db.query(
        `SELECT username, first_name, points 
     FROM users 
     WHERE is_banned = 0 
     ORDER BY points DESC 
     LIMIT 10`
    );

    let leaderboardText = '🏆 *Top 10 Players*\n\n';

    users.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const name = user.username ? `@${user.username}` : user.first_name;
        leaderboardText += `${medal} ${name} - ${user.points} points\n`;
    });

    await bot.sendMessage(chatId, leaderboardText, { parse_mode: 'Markdown' });
}

// Handler: /missions
async function handleMissions(msg) {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, '📋 Click the button below to view and complete missions!', {
        reply_markup: {
            inline_keyboard: [[
                { text: '📋 View Missions', web_app: { url: `${webAppUrl}#missions` } }
            ]]
        }
    });
}

// Send welcome message
async function sendWelcomeMessage(chatId, firstName, referralCode) {
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

    await bot.sendMessage(chatId, welcomeText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: '🚀 Play Now', web_app: { url: webAppUrl } }
            ]]
        }
    });
}

module.exports = {
    bot,
    setWebhook,
    processUpdate
};
