const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id TEXT UNIQUE NOT NULL,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      wallet_address TEXT,
      points INTEGER DEFAULT 0,
      referral_code TEXT UNIQUE,
      referred_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_banned INTEGER DEFAULT 0,
      captcha_verified INTEGER DEFAULT 0
    )
  `);

    // Social media links table
    db.run(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      username TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, platform)
    )
  `);

    // Missions table
    db.run(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      points_reward INTEGER NOT NULL,
      mission_type TEXT NOT NULL,
      frequency TEXT NOT NULL,
      required_proof INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // User missions (task completion tracking)
    db.run(`
    CREATE TABLE IF NOT EXISTS user_missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mission_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      proof_url TEXT,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (mission_id) REFERENCES missions(id),
      UNIQUE(user_id, mission_id, created_at)
    )
  `);

    // Referrals table
    db.run(`
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_id INTEGER NOT NULL,
      referred_id INTEGER NOT NULL,
      points_earned INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referrer_id) REFERENCES users(id),
      FOREIGN KEY (referred_id) REFERENCES users(id)
    )
  `);

    // Leaderboard cache
    db.run(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      points INTEGER NOT NULL,
      rank INTEGER NOT NULL,
      period TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

    // Airdrop eligibility
    db.run(`
    CREATE TABLE IF NOT EXISTS airdrop_eligibility (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      eligible INTEGER DEFAULT 0,
      min_points_met INTEGER DEFAULT 0,
      min_referrals_met INTEGER DEFAULT 0,
      wallet_verified INTEGER DEFAULT 0,
      social_links_met INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id)
    )
  `);

    // Broadcast messages
    db.run(`
    CREATE TABLE IF NOT EXISTS broadcasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_users TEXT,
      sent_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent_at DATETIME
    )
  `);

    // Activity log (for anti-spam)
    db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

    // Insert default missions
    db.run(`
    INSERT OR IGNORE INTO missions (id, title, description, points_reward, mission_type, frequency, required_proof)
    VALUES 
      (1, 'Follow on X (Twitter)', 'Follow our official X account', 100, 'social', 'once', 1),
      (2, 'Follow on Instagram', 'Follow our Instagram page', 100, 'social', 'once', 1),
      (3, 'Follow on TikTok', 'Follow our TikTok account', 100, 'social', 'once', 1),
      (4, 'Subscribe on YouTube', 'Subscribe to our YouTube channel', 100, 'social', 'once', 1),
      (5, 'Like on Facebook', 'Like our Facebook page', 100, 'social', 'once', 1),
      (6, 'Daily Check-in', 'Check in daily to earn points', 50, 'daily', 'daily', 0),
      (7, 'Share on Social Media', 'Share our project on your social media', 200, 'weekly', 'weekly', 1),
      (8, 'Invite 3 Friends', 'Invite 3 friends using your referral link', 300, 'referral', 'once', 0)
  `);

    console.log('Database initialized successfully');
});

module.exports = db;
