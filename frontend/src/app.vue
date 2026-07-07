<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3005/api/books'; // ⬅️ เปลี่ยนเป็น 3005
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