const db = require('../database-mysql');
const crypto = require('crypto');

// Generate random referral code
function generateReferralCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Check if user is spamming
async function isSpamming(telegramId, actionType) {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const [result] = await db.query(
            `SELECT COUNT(*) as count FROM activity_log 
       WHERE user_id = (SELECT id FROM users WHERE telegram_id = ?) 
       AND action_type = ? 
       AND created_at > ?`,
            [telegramId, actionType, fiveMinutesAgo]
        );

        // Allow max 5 actions of same type in 5 minutes
        return result[0].count >= 5;
    } catch (error) {
        console.error('Error checking spam:', error);
        return false;
    }
}

// Log user activity
async function logActivity(telegramId, actionType) {
    try {
        const [users] = await db.query('SELECT id FROM users WHERE telegram_id = ?', [telegramId]);

        if (users.length === 0) return;

        await db.query(
            'INSERT INTO activity_log (user_id, action_type) VALUES (?, ?)',
            [users[0].id, actionType]
        );
    } catch (error) {
        console.error('Error logging activity:', error);
    }
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
    try {
        const [result] = await db.query(
            `SELECT COUNT(*) + 1 as rank FROM users 
       WHERE points > (SELECT points FROM users WHERE id = ?) 
       AND is_banned = 0`,
            [userId]
        );
        return result[0].rank;
    } catch (error) {
        console.error('Error getting user rank:', error);
        return 0;
    }
}

module.exports = {
    generateReferralCode,
    isSpamming,
    logActivity,
    isValidWalletAddress,
    calculateAirdropEligibility,
    getUserRank
};
