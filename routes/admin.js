const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database');
const bot = require('../bot');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

// Middleware to check admin authentication
function isAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Admin logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
});

// Check admin status
router.get('/status', (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
});

// Get dashboard stats
router.get('/stats', isAdmin, (req, res) => {
    const stats = {};

    db.get('SELECT COUNT(*) as count FROM users', [], (err, result) => {
        stats.totalUsers = result ? result.count : 0;

        db.get('SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = DATE("now")', [], (err, result) => {
            stats.newUsersToday = result ? result.count : 0;

            db.get('SELECT SUM(points) as total FROM users', [], (err, result) => {
                stats.totalPoints = result ? result.total : 0;

                db.get('SELECT COUNT(*) as count FROM referrals', [], (err, result) => {
                    stats.totalReferrals = result ? result.count : 0;

                    db.get('SELECT COUNT(*) as count FROM airdrop_eligibility WHERE eligible = 1', [], (err, result) => {
                        stats.eligibleUsers = result ? result.count : 0;

                        res.json({ stats });
                    });
                });
            });
        });
    });
});

// Get all users
router.get('/users', isAdmin, (req, res) => {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM users WHERE 1=1`;
    let params = [];

    if (search) {
        query += ` AND (username LIKE ? OR first_name LIKE ? OR wallet_address LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        db.get('SELECT COUNT(*) as count FROM users', [], (err, result) => {
            res.json({
                users,
                total: result.count,
                page: parseInt(page),
                totalPages: Math.ceil(result.count / limit)
            });
        });
    });
});

// Ban/Unban user
router.post('/users/:id/ban', isAdmin, (req, res) => {
    const { id } = req.params;
    const { banned } = req.body;

    db.run('UPDATE users SET is_banned = ? WHERE id = ?', [banned ? 1 : 0, id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: banned ? 'User banned' : 'User unbanned' });
    });
});

// Get all missions
router.get('/missions', isAdmin, (req, res) => {
    db.all('SELECT * FROM missions ORDER BY id', [], (err, missions) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ missions });
    });
});

// Create mission
router.post('/missions', isAdmin, (req, res) => {
    const { title, description, pointsReward, missionType, frequency, requiredProof } = req.body;

    db.run(
        `INSERT INTO missions (title, description, points_reward, mission_type, frequency, required_proof)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, pointsReward, missionType, frequency, requiredProof ? 1 : 0],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Mission created', id: this.lastID });
        }
    );
});

// Update mission
router.put('/missions/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { title, description, pointsReward, isActive } = req.body;

    db.run(
        'UPDATE missions SET title = ?, description = ?, points_reward = ?, is_active = ? WHERE id = ?',
        [title, description, pointsReward, isActive ? 1 : 0, id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Mission updated' });
        }
    );
});

// Delete mission
router.delete('/missions/:id', isAdmin, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM missions WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Mission deleted' });
    });
});

// Get pending mission submissions
router.get('/missions/pending', isAdmin, (req, res) => {
    db.all(
        `SELECT um.*, u.username, u.first_name, u.telegram_id, m.title, m.points_reward
     FROM user_missions um
     JOIN users u ON um.user_id = u.id
     JOIN missions m ON um.mission_id = m.id
     WHERE um.status = 'pending'
     ORDER BY um.created_at DESC`,
        [],
        (err, submissions) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ submissions });
        }
    );
});

// Approve/Reject mission submission
router.post('/missions/submissions/:id/review', isAdmin, (req, res) => {
    const { id } = req.params;
    const { approved } = req.body;

    db.get('SELECT * FROM user_missions WHERE id = ?', [id], (err, submission) => {
        if (err || !submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        const status = approved ? 'completed' : 'rejected';

        db.run(
            'UPDATE user_missions SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (approved) {
                    // Award points
                    db.get('SELECT points_reward FROM missions WHERE id = ?', [submission.mission_id], (err, mission) => {
                        if (mission) {
                            db.run('UPDATE users SET points = points + ? WHERE id = ?', [mission.points_reward, submission.user_id]);
                        }
                    });
                }

                res.json({ success: true, message: approved ? 'Mission approved' : 'Mission rejected' });
            }
        );
    });
});

// Broadcast message
router.post('/broadcast', isAdmin, (req, res) => {
    const { message, targetType, targetUsers } = req.body;

    // Save broadcast record
    db.run(
        'INSERT INTO broadcasts (message, target_type, target_users) VALUES (?, ?, ?)',
        [message, targetType, targetUsers ? JSON.stringify(targetUsers) : null],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const broadcastId = this.lastID;
            let query = 'SELECT telegram_id FROM users WHERE is_banned = 0';
            let params = [];

            if (targetType === 'selected' && targetUsers && targetUsers.length > 0) {
                query += ` AND id IN (${targetUsers.map(() => '?').join(',')})`;
                params = targetUsers;
            }

            db.all(query, params, async (err, users) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                let sentCount = 0;

                for (const user of users) {
                    try {
                        await bot.sendMessage(user.telegram_id, message);
                        sentCount++;
                    } catch (error) {
                        console.error(`Error sending to ${user.telegram_id}:`, error);
                    }
                }

                // Update broadcast record
                db.run(
                    'UPDATE broadcasts SET sent_count = ?, sent_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [sentCount, broadcastId]
                );

                res.json({ success: true, message: `Broadcast sent to ${sentCount} users` });
            });
        }
    );
});

// Export users to CSV
router.get('/export/users', isAdmin, (req, res) => {
    db.all(
        `SELECT 
      u.telegram_id,
      u.username,
      u.first_name,
      u.last_name,
      u.wallet_address,
      u.points,
      u.referral_code,
      u.created_at,
      (SELECT COUNT(*) FROM referrals WHERE referrer_id = u.id) as referral_count,
      (SELECT GROUP_CONCAT(platform || ':' || username) FROM social_links WHERE user_id = u.id) as social_links
     FROM users u
     WHERE u.is_banned = 0
     ORDER BY u.points DESC`,
        [],
        async (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const csvPath = path.join(__dirname, '..', 'exports', `users_${Date.now()}.csv`);

            const csvWriter = createObjectCsvWriter({
                path: csvPath,
                header: [
                    { id: 'telegram_id', title: 'Telegram ID' },
                    { id: 'username', title: 'Username' },
                    { id: 'first_name', title: 'First Name' },
                    { id: 'last_name', title: 'Last Name' },
                    { id: 'wallet_address', title: 'Wallet Address' },
                    { id: 'points', title: 'Points' },
                    { id: 'referral_code', title: 'Referral Code' },
                    { id: 'referral_count', title: 'Referrals' },
                    { id: 'social_links', title: 'Social Links' },
                    { id: 'created_at', title: 'Joined Date' }
                ]
            });

            try {
                await csvWriter.writeRecords(users);
                res.download(csvPath);
            } catch (error) {
                res.status(500).json({ error: 'Error creating CSV' });
            }
        }
    );
});

module.exports = router;
