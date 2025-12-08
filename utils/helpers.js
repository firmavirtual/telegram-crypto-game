const db = require('../database');
const crypto = require('crypto');

// Generate random referral code
function generateReferralCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Check if user is spamming
async function isSpamming(telegramId, actionType) {
    return new Promise((resolve, reject) => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        db.get(
            `SELECT COUNT(*) as count FROM activity_log 
       WHERE user_id = (SELECT id FROM users WHERE telegram_id = ?) 
       AND action_type = ? 
       AND created_at > ?`,
            [telegramId, actionType, fiveMinutesAgo],
            (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                // Allow max 5 actions of same type in 5 minutes
                resolve(result.count >= 5);
            }
        );
    });
}

// Log user activity
async function logActivity(telegramId, actionType) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
            if (err || !user) {
                reject(err);
                return;
            }

            db.run(
                'INSERT INTO activity_log (user_id, action_type) VALUES (?, ?)',
                [user.id, actionType],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    });
}

// Validate wallet address (basic validation - customize for your blockchain)
function isValidWalletAddress(address) {
    // Example for Ethereum-like addresses
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Calculate user's airdrop eligibility
function calculateAirdropEligibility(user, socialLinks, referralCount) {
    const minPoints = 1000;
    const minReferrals = 3;
    const minSocialLinks = 3;

    return {
        eligible: user.points >= minPoints &&
            referralCount >= minReferrals &&
            user.wallet_address &&
            socialLinks.length >= minSocialLinks,
        minPointsMet: user.points >= minPoints,
        minReferralsMet: referralCount >= minReferrals,
        walletVerified: !!user.wallet_address,
        socialLinksMet: socialLinks.length >= minSocialLinks
    };
}

// Get user rank
async function getUserRank(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT COUNT(*) + 1 as rank FROM users 
       WHERE points > (SELECT points FROM users WHERE id = ?) 
       AND is_banned = 0`,
            [userId],
            (err, result) => {
                if (err) reject(err);
                else resolve(result.rank);
            }
        );
    });
}

module.exports = {
    generateReferralCode,
    isSpamming,
    logActivity,
    isValidWalletAddress,
    calculateAirdropEligibility,
    getUserRank
};
