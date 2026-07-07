import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// ฟังก์ชันจำลองการสร้าง Table อัตโนมัติถ้าไม่มีข้อมูลอยู่จริง (Persist Check)
export const initDB = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      isbn VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL
    );
  `;
  await pool.query(queryText);
};

export default pool;