const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

// 1. GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'UP', version: '1.0.0' });
});

// 2. GET /api/books (ดึงข้อมูลทั้งหมด)
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET /api/books/:id (ดึงทีละตัว)
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /api/books (เพิ่มหนังสือ)
app.post('/api/books', async (req, res) => {
  try {
    const { isbn, title, author, category, year, status } = req.body;
    const result = await pool.query(
      'INSERT INTO books (isbn, title, author, category, year, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [isbn, title, author, category, year, status || 'พร้อมให้ยืม']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PUT /api/books/:id (แก้ไขข้อมูล)
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isbn, title, author, category, year, status } = req.body;
    const result = await pool.query(
      'UPDATE books SET isbn=$1, title=$2, author=$3, category=$4, year=$5, status=$6 WHERE id=$7 RETURNING *',
      [isbn, title, author, category, year, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. DELETE /api/books/:id (ลบหนังสือ)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});




if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;