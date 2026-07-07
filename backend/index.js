import express from 'express';
import cors from 'cors';
import pool, { initDB } from './db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// เริ่มต้นสร้าง Table ใน DB
if (process.env.NODE_ENV !== 'test') {
  initDB().catch(err => console.error("Database initialization failed:", err));
}

// 1. Endpoint: GET /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: "UP", version: "1.0.0" });
});

// 2. Endpoint: GET /api/books (ดึงข้อมูลทั้งหมด)
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Endpoint: GET /api/books/:id (ดึงข้อมูลตาม ID)
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Endpoint: POST /api/books (เพิ่มหนังสือใหม่)
app.post('/api/books', async (req, res) => {
  try {
    const { isbn, title, author, category, year, status } = req.body;
    const result = await pool.query(
      'INSERT INTO books (isbn, title, author, category, year, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [isbn, title, author, category, parseInt(year), status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Endpoint: PUT /api/books/:id (แก้ไขข้อมูล)
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isbn, title, author, category, year, status } = req.body;
    const result = await pool.query(
      'UPDATE books SET isbn=$1, title=$2, author=$3, category=$4, year=$5, status=$6 WHERE id=$7 RETURNING *',
      [isbn, title, author, category, parseInt(year), status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Endpoint: DELETE /api/books/:id (ลบหนังสือ)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;