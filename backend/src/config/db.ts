import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mindmate',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const initializeDatabase = async () => {
  console.log('🔄 Checking database table initializations...');
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create moods table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS moods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mood VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create journals table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS journals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create ai_analysis table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ai_analysis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        journal_id INT NOT NULL,
        emotion VARCHAR(100) NOT NULL,
        sentiment VARCHAR(50) NOT NULL,
        stress_score INT NOT NULL,
        stress_trigger VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        coping_strategy TEXT NOT NULL,
        motivation TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create indexes for query performance optimization (Phase 6)
    console.log('⚡ Ensuring database performance indexes exist...');
    await connection.query('CREATE INDEX IF NOT EXISTS idx_moods_user_created ON moods (user_id, created_at);');
    await connection.query('CREATE INDEX IF NOT EXISTS idx_journals_user_created ON journals (user_id, created_at);');
    await connection.query('CREATE INDEX IF NOT EXISTS idx_ai_analysis_journal ON ai_analysis (journal_id);');

    connection.release();
    console.log('✅ Database tables and indexes are verified and ready.');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

export default pool;
