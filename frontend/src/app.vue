ue<template>
  <div class="container">
    <header>
      <h1>📚 ระบบบันทึกข้อมูลหนังสือห้องสมุด (libbook)</h1>
      <div class="developer-info">
        <p><strong>ผู้ทำ:</strong> นายวรวิช จำปานิล | <strong>รหัสนักศึกษา:</strong> 68319010039</p>
      </div>
    </header>

    <main class="main-content">
      <section class="form-section">
        <h2>{{ isEditing ? '📝 แก้ไขข้อมูลหนังสือ' : '➕ เพิ่มหนังสือใหม่' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>เลขทะเบียน / ISBN:</label>
            <input v-model="bookForm.isbn" type="text" required placeholder="เช่น 978-616-08-xxxx-x" />
          </div>
          <div class="form-group">
            <label>ชื่อหนังสือ:</label>
            <input v-model="bookForm.title" type="text" required />
          </div>
          <div class="form-group">
            <label>ผู้แต่ง:</label>
            <input v-model="bookForm.author" type="text" required />
          </div>
          <div class="form-group">
            <label>หมวดหมู่:</label>
            <input v-model="bookForm.category" type="text" required placeholder="เช่น เทคโนโลยี, นวนิยาย" />
          </div>
          <div class="form-group">
            <label>ปีที่พิมพ์:</label>
            <input v-model.number="bookForm.year" type="number" required />
          </div>
          <div class="form-group">
            <label>สถานะ:</label>
            <select v-model="bookForm.status">
              <option value="พร้อมให้ยืม">พร้อมให้ยืม</option>
              <option value="ถูกยืม">ถูกยืม</option>
              <option value="ชำรุด">ชำรุด</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="submit" class="btn btn-success">{{ isEditing ? 'อัปเดต' : 'บันทึก' }}</button>
            <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">ยกเลิก</button>
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
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.isbn }}</td>
              <td>
                <strong>{{ book.title }}</strong><br>
                <small style="color:#666">หมวด: {{ book.category }} | ปี: {{ book.year }}</small>
              </td>
              <td>{{ book.author }}</td>
              <td>
                <span :class="['badge', getStatusClass(book.status)]">
                  {{ book.status }}
                </span>
              </td>
              <td>
                <button @click="editBook(book)" class="btn btn-warning">แก้ไข</button>
                <button @click="deleteBook(book.id)" class="btn btn-danger">ลบ</button>
              </td>
            </tr>
            <tr v-if="books.length === 0">
              <td colspan="5" style="text-align: center; color: #888;">ไม่มีข้อมูลหนังสือในระบบ</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3001/api/books';

const books = ref([]);
const isEditing = ref(false);
const currentBookId = ref(null);

const bookForm = ref({
  isbn: '',
  title: '',
  author: '',
  category: '',
  year: 2026,
  status: 'พร้อมให้ยืม'
});

const fetchBooks = async () => {
  try {
    const res = await fetch(API_URL);
    books.value = await res.json();
  } catch (err) {
    console.error('Error fetching books:', err);
  }
};

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

const deleteBook = async (id) => {
  if (!confirm('คุณแน่ใจใช่ไหมที่จะลบหนังสือเล่มนี้?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchBooks();
  } catch (err) {
    console.error('Error deleting book:', err);
  }
};

const editBook = (book) => {
  isEditing.value = true;
  currentBookId.value = book.id;
  bookForm.value = { ...book };
};

const resetForm = () => {
  isEditing.value = false;
  currentBookId.value = null;
  bookForm.value = { isbn: '', title: '', author: '', category: '', year: 2026, status: 'พร้อมให้ยืม' };
};

const getStatusClass = (status) => {
  if (status === 'พร้อมให้ยืม') return 'badge-available';
  if (status === 'ถูกยืม') return 'badge-borrowed';
  return 'badge-damaged';
};

onMounted(fetchBooks);
</script>

<style scoped>
body { font-family: sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
.container { max-width: 1100px; margin: 0 auto; }
header { background: #e9ecef; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
.main-content { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
@media (max-width: 768px) { .main-content { grid-template-columns: 1fr; } }
.form-section, .list-section { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 12px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input, .form-group select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; }
.btn-success { background-color: #28a745; width: 100%; }
.btn-warning { background-color: #ffc107; color: black; margin-right: 5px; }
.btn-danger { background-color: #dc3545; }
.btn-secondary { background-color: #6c757d; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background-color: #f8f9fa; }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 0.85em; font-weight: bold; }
.badge-available { background-color: #d4edda; color: #155724; }
.badge-borrowed { background-color: #fff3cd; color: #856404; }
.badge-damaged { background-color: #f8d7da; color: #721c24; }
</style>