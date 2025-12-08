const mysql = require('mysql2/promise');

// Configuración de MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'telegram_game',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Inicializar base de datos
async function initDatabase() {
    const connection = await pool.getConnection();

    try {
        // Users table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        telegram_id VARCHAR(50) UNIQUE NOT NULL,
        username VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        wallet_address VARCHAR(255),
        points INT DEFAULT 0,
        referral_code VARCHAR(20) UNIQUE,
        referred_by VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_banned TINYINT(1) DEFAULT 0,
        captcha_verified TINYINT(1) DEFAULT 0,
        INDEX idx_telegram_id (telegram_id),
        INDEX idx_referral_code (referral_code),
        INDEX idx_points (points)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Social media links table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        platform VARCHAR(50) NOT NULL,
        username VARCHAR(255) NOT NULL,
        verified TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_platform (user_id, platform)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Missions table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS missions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        points_reward INT NOT NULL,
        mission_type VARCHAR(50) NOT NULL,
        frequency VARCHAR(20) NOT NULL,
        required_proof TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // User missions table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS user_missions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mission_id INT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        proof_url TEXT,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
        INDEX idx_user_mission (user_id, mission_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Referrals table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS referrals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        referrer_id INT NOT NULL,
        referred_id INT NOT NULL,
        points_earned INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Leaderboard table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        points INT NOT NULL,
        rank INT NOT NULL,
        period VARCHAR(20) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_period_rank (period, rank)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Airdrop eligibility table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS airdrop_eligibility (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        eligible TINYINT(1) DEFAULT 0,
        min_points_met TINYINT(1) DEFAULT 0,
        min_referrals_met TINYINT(1) DEFAULT 0,
        wallet_verified TINYINT(1) DEFAULT 0,
        social_links_met TINYINT(1) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Broadcasts table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS broadcasts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT NOT NULL,
        target_type VARCHAR(20) NOT NULL,
        target_users TEXT,
        sent_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sent_at TIMESTAMP NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Activity log table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_action (user_id, action_type, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        // Insert default missions
        await connection.query(`
      INSERT IGNORE INTO missions (id, title, description, points_reward, mission_type, frequency, required_proof)
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

        console.log('✅ MySQL database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Inicializar al cargar el módulo
initDatabase().catch(console.error);

module.exports = pool;
