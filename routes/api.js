const express = require('express');
const router = express.Router();
const db = require('../database');
const { isValidWalletAddress, getUserRank, calculateAirdropEligibility } = require('../utils/helpers');

// Get user data
router.get('/user/:telegramId', (req, res) => {
    const { telegramId } = req.params;

    db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get social links
        db.all('SELECT * FROM social_links WHERE user_id = ?', [user.id], (err, socialLinks) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Get referral count
            db.get('SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?', [user.id], async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                const rank = await getUserRank(user.id);

                res.json({
                    user: {
                        id: user.id,
                        telegramId: user.telegram_id,
                        username: user.username,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        walletAddress: user.wallet_address,
                        points: user.points,
                        referralCode: user.referral_code,
                        rank: rank
                    },
                    socialLinks: socialLinks,
                    referralCount: result.count
                });
            });
        });
    });
});

// Update wallet address
router.post('/user/:telegramId/wallet', (req, res) => {
    const { telegramId } = req.params;
    const { walletAddress } = req.body;

    if (!isValidWalletAddress(walletAddress)) {
        return res.status(400).json({ error: 'Invalid wallet address' });
    }

    db.run(
        'UPDATE users SET wallet_address = ? WHERE telegram_id = ?',
        [walletAddress, telegramId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Wallet address updated' });
        }
    );
});

// Add social link
router.post('/user/:telegramId/social', (req, res) => {
    const { telegramId } = req.params;
    const { platform, username } = req.body;

    if (!platform || !username) {
        return res.status(400).json({ error: 'Platform and username required' });
    }

    db.get('SELECT id FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.run(
            'INSERT OR REPLACE INTO social_links (user_id, platform, username) VALUES (?, ?, ?)',
            [user.id, platform, username],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ success: true, message: 'Social link added' });
            }
        );
    });
});

// Get missions
router.get('/missions', (req, res) => {
    db.all('SELECT * FROM missions WHERE is_active = 1 ORDER BY id', [], (err, missions) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ missions });
    });
});

// Get user missions
router.get('/user/:telegramId/missions', (req, res) => {
    const { telegramId } = req.params;

    db.get('SELECT id FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.all(
            `SELECT um.*, m.title, m.description, m.points_reward, m.mission_type, m.frequency, m.required_proof
       FROM user_missions um
       JOIN missions m ON um.mission_id = m.id
       WHERE um.user_id = ?
       ORDER BY um.created_at DESC`,
            [user.id],
            (err, userMissions) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ userMissions });
            }
        );
    });
});

// Submit mission
router.post('/user/:telegramId/missions/:missionId/submit', (req, res) => {
    const { telegramId, missionId } = req.params;
    const { proofUrl } = req.body;

    db.get('SELECT id FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if mission exists
        db.get('SELECT * FROM missions WHERE id = ?', [missionId], (err, mission) => {
            if (err || !mission) {
                return res.status(404).json({ error: 'Mission not found' });
            }

            // Check if already completed (for once/daily missions)
            const checkQuery = mission.frequency === 'daily'
                ? `SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ? AND DATE(created_at) = DATE('now')`
                : `SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ? AND status = 'completed'`;

            db.get(checkQuery, [user.id, missionId], (err, existing) => {
                if (existing && mission.frequency !== 'weekly') {
                    return res.status(400).json({ error: 'Mission already completed' });
                }

                // Insert mission submission
                db.run(
                    `INSERT INTO user_missions (user_id, mission_id, status, proof_url) VALUES (?, ?, ?, ?)`,
                    [user.id, missionId, mission.required_proof ? 'pending' : 'completed', proofUrl || null],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Database error' });
                        }

                        // If no proof required, award points immediately
                        if (!mission.required_proof) {
                            db.run(
                                'UPDATE users SET points = points + ? WHERE id = ?',
                                [mission.points_reward, user.id],
                                (err) => {
                                    if (err) {
                                        return res.status(500).json({ error: 'Database error' });
                                    }
                                    res.json({ success: true, message: 'Mission completed', pointsEarned: mission.points_reward });
                                }
                            );
                        } else {
                            res.json({ success: true, message: 'Mission submitted for review' });
                        }
                    }
                );
            });
        });
    });
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
    const { limit = 100, period = 'all' } = req.query;

    db.all(
        `SELECT u.username, u.first_name, u.points, u.telegram_id
     FROM users u
     WHERE u.is_banned = 0
     ORDER BY u.points DESC
     LIMIT ?`,
        [parseInt(limit)],
        (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const leaderboard = users.map((user, index) => ({
                rank: index + 1,
                username: user.username || user.first_name,
                points: user.points,
                telegramId: user.telegram_id
            }));

            res.json({ leaderboard });
        }
    );
});

// Get airdrop eligibility
router.get('/user/:telegramId/airdrop', (req, res) => {
    const { telegramId } = req.params;

    db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.all('SELECT * FROM social_links WHERE user_id = ?', [user.id], (err, socialLinks) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            db.get('SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?', [user.id], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                const eligibility = calculateAirdropEligibility(user, socialLinks, result.count);
                res.json({ eligibility });
            });
        });
    });
});

// Daily check-in
router.post('/user/:telegramId/checkin', (req, res) => {
    const { telegramId } = req.params;

    db.get('SELECT id FROM users WHERE telegram_id = ?', [telegramId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already checked in today
        db.get(
            `SELECT * FROM user_missions 
       WHERE user_id = ? AND mission_id = 6 AND DATE(created_at) = DATE('now')`,
            [user.id],
            (err, existing) => {
                if (existing) {
                    return res.status(400).json({ error: 'Already checked in today' });
                }

                // Add check-in record
                db.run(
                    'INSERT INTO user_missions (user_id, mission_id, status, completed_at) VALUES (?, 6, ?, CURRENT_TIMESTAMP)',
                    [user.id, 'completed'],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Database error' });
                        }

                        // Award points
                        db.run('UPDATE users SET points = points + 50 WHERE id = ?', [user.id], (err) => {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' });
                            }
                            res.json({ success: true, message: 'Check-in successful', pointsEarned: 50 });
                        });
                    }
                );
            }
        );
    });
});

module.exports = router;
