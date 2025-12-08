const db = require('../database');
const bot = require('../bot');
const { calculateAirdropEligibility } = require('./helpers');

// Update leaderboard
function updateLeaderboard() {
    // Clear existing leaderboard
    db.run('DELETE FROM leaderboard WHERE period = ?', ['weekly'], (err) => {
        if (err) {
            console.error('Error clearing leaderboard:', err);
            return;
        }

        // Insert new leaderboard data
        db.all(
            `SELECT id, points FROM users WHERE is_banned = 0 ORDER BY points DESC LIMIT 100`,
            [],
            (err, users) => {
                if (err) {
                    console.error('Error fetching users for leaderboard:', err);
                    return;
                }

                users.forEach((user, index) => {
                    db.run(
                        `INSERT INTO leaderboard (user_id, points, rank, period) VALUES (?, ?, ?, ?)`,
                        [user.id, user.points, index + 1, 'weekly']
                    );
                });

                console.log('Leaderboard updated successfully');
            }
        );
    });
}

// Check airdrop eligibility for all users
function checkAirdropEligibility() {
    db.all('SELECT * FROM users WHERE is_banned = 0', [], (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return;
        }

        users.forEach(user => {
            // Get social links
            db.all('SELECT * FROM social_links WHERE user_id = ?', [user.id], (err, socialLinks) => {
                if (err) return;

                // Get referral count
                db.get('SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?', [user.id], (err, result) => {
                    if (err) return;

                    const referralCount = result.count;
                    const eligibility = calculateAirdropEligibility(user, socialLinks, referralCount);

                    // Update or insert eligibility record
                    db.run(
                        `INSERT OR REPLACE INTO airdrop_eligibility 
             (user_id, eligible, min_points_met, min_referrals_met, wallet_verified, social_links_met, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                        [
                            user.id,
                            eligibility.eligible ? 1 : 0,
                            eligibility.minPointsMet ? 1 : 0,
                            eligibility.minReferralsMet ? 1 : 0,
                            eligibility.walletVerified ? 1 : 0,
                            eligibility.socialLinksMet ? 1 : 0
                        ]
                    );
                });
            });
        });

        console.log('Airdrop eligibility checked for all users');
    });
}

// Send daily reminders
function sendDailyReminders() {
    db.all(
        `SELECT telegram_id, first_name FROM users 
     WHERE is_banned = 0 
     AND last_active > datetime('now', '-7 days')`,
        [],
        (err, users) => {
            if (err) {
                console.error('Error fetching users for reminders:', err);
                return;
            }

            users.forEach(user => {
                const message = `
🌅 Good morning, ${user.first_name}!

Don't forget to:
✅ Complete your daily check-in
✅ Check new missions
✅ Climb the leaderboard

Keep earning points to qualify for the airdrop! 🚀
        `;

                bot.sendMessage(user.telegram_id, message).catch(err => {
                    console.error(`Error sending reminder to ${user.telegram_id}:`, err);
                });
            });

            console.log(`Daily reminders sent to ${users.length} users`);
        }
    );
}

// Announce weekly winners
function announceWeeklyWinners() {
    db.all(
        `SELECT u.telegram_id, u.username, u.first_name, u.points 
     FROM users u 
     WHERE u.is_banned = 0 
     ORDER BY u.points DESC 
     LIMIT 10`,
        [],
        (err, winners) => {
            if (err) {
                console.error('Error fetching weekly winners:', err);
                return;
            }

            if (winners.length === 0) return;

            // Create announcement message
            let announcement = '🏆 *Weekly Leaderboard Winners!* 🏆\n\n';

            winners.forEach((winner, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                const name = winner.username ? `@${winner.username}` : winner.first_name;
                announcement += `${medal} ${name} - ${winner.points} points\n`;
            });

            announcement += '\n🎉 Congratulations to all winners!\nKeep playing to stay on top! 🚀';

            // Send to all active users
            db.all(
                'SELECT telegram_id FROM users WHERE is_banned = 0',
                [],
                (err, users) => {
                    if (err) return;

                    users.forEach(user => {
                        bot.sendMessage(user.telegram_id, announcement, { parse_mode: 'Markdown' })
                            .catch(err => console.error(`Error sending announcement to ${user.telegram_id}:`, err));
                    });

                    console.log(`Weekly winners announced to ${users.length} users`);
                }
            );
        }
    );
}

module.exports = {
    updateLeaderboard,
    checkAirdropEligibility,
    sendDailyReminders,
    announceWeeklyWinners
};
