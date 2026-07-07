<template>
  <div class="container">
    <header>
      <h1>📚 ระบบบันทึกข้อมูลหนังสือห้องสมุด (libbook)</h1>
      <div class="developer-info">
        <p><strong>ผู้พัฒนา:</strong> นายสมชาย รักเรียน | <strong>รหัสนักศึกษา:</strong> 6504011234 | <strong>ชั้น:</strong> สบท.3/1</p>
      </div>
    </header>

    <main>
      <section class="form-section">
        <h2>{{ isEditing ? '📝 แก้ไขข้อมูลหนังสือ' : '➕ เพิ่มหนังสือใหม่' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>เลขทะเบียน / ISBN:</label>
            <input v-model="bookForm.isbn" type="text" required placeholder="เช่น 978-616-08-xxxx-x" />
          </div>
          <div class="form-group">
            <label>ชื่อหนังสือ:</label>
            <input v-model="bookForm.title" type="text" required placeholder="ชื่อหนังสือ" />
          </div>
          <div class="form-group">
            <label>ผู้แต่ง:</label>
            <input v-model="bookForm.author" type="text" required placeholder="ชื่อผู้แต่ง" />
          </div>
          <div class="form-group">
            <label>หมวดหมู่:</label>
            <input v-model="bookForm.category" type="text" required placeholder="เช่น นวนิยาย, เทคโนโลยี" />
          </div>
          <div class="form-group">
            <label>ปีที่พิมพ์:</label>
            <input v-model.number="bookForm.year" type="number" required placeholder="เช่น 2024" />
          </div>
          <div class="form-group">
            <label>สถานะ:</label>
            <select v-model="bookForm.status">
              <option value="พร้อมให้ยืม">พร้อมให้ยืม</option>
              <option value="ถูกยืม">ถูกยืม</option>
              <option value="ชำรุด">ชำรุด</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">{{ isEditing ? 'อัปเดต' : 'บันทึก' }}</button>
            <button v-if="isEditing" type="button" @click="resetForm" class="btn-cancel">ยกเลิก</button>
          </div>
        </form>
      </section>

      <section class="list-section">
        <h2>📋 ทะเบียนหนังสือทั้งหมด</h2>
        <table>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>ชื่อหนังสือ</th>
              <th>ผู้แต่ง</th>
              <th>หมวดหมู่</th>
              <th>ปีที่พิมพ์</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.isbn }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.category }}</td>
              <td>{{ book.year }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(book.status)]">
                  {{ book.status }}
                </span>
              </td>
              <td>
                <button @click="editBook(book)" class="btn-edit">แก้ไข</button>
                <button @click="deleteBook(book.id)" class="btn-delete">ลบ</button>
              </td>
            </tr>
            <tr v-if="books.length === 0">
              <td colspan="7" style="text-align: center; color: #888;">ไม่มีข้อมูลหนังสือในระบบ</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// ระบุ URL ไปที่ Backend พอร์ต 3001
const API_URL = 'http://localhost:3001/api/books';

const books = ref([]);
const isEditing = ref(false);
const currentBookId = ref(null);

const bookForm = ref({
  isbn: '',
  title: '',
  author: '',
  category: '',
  year: new Date().getFullYear(),
  status: 'พร้อมให้ยืม'
});

// ดึงข้อมูลหนังสือทั้งหมด (GET)
const fetchBooks = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network response was not ok');
    books.value = await res.json();
  } catch (err) {
    console.error('Error fetching books:', err);
  }
};

// ส่งข้อมูล บันทึก/แก้ไข (POST / PUT)
const handleSubmit = async () => {
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value ? `${API_URL}/${currentBookId.value}` : API_URL;

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookForm.value)
    });

    if (res.ok) {
      await fetchBooks();
      resetForm();
    }
  } catch (err) {
    console.error('Error saving book:', err);
  }
};

// ลบข้อมูลหนังสือ (DELETE)
const deleteBook = async (id) => {
  if (!confirm('คุณแน่ใจใช่ไหมที่จะลบหนังสือเล่มนี้?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchBooks();
    }
  } catch (err) {
    console.error('Error deleting book:', err);
  }
};

//