const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// สร้าง Table ถ้ายังไม่มี (ช่วยให้ทำงานง่ายขึ้นเมื่อรันครั้งแรก)
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      isbn VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'พร้อมให้ยืม'
    );
  `;
  try {
    await pool.query(queryText);
    console.log("Database table 'books' verified/created.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

initDb();

module.exports = pool;