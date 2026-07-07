const API_URL = 'http://localhost:3001/api/books';

const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');

let isEditing = false;

// ฟังก์ชัน: ดึงข้อมูลหนังสือทั้งหมดมาแสดงในตาราง (GET)
async function fetchBooks() {
    try {
        const res = await fetch(API_URL);
        const books = await res.json();
        bookList.innerHTML = '';
        
        if(books.length === 0) {
            bookList.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">ไม่มีข้อมูลหนังสือ</td></tr>`;
            return;
        }

        books.forEach(book => {
            let statusClass = 'badge-available';
            if (book.status === 'ถูกยืม') statusClass = 'badge-borrowed';
            if (book.status === 'ชำรุด') statusClass = 'badge-damaged';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.isbn}</td>
                <td><strong>${book.title}</strong><br><small style="color:#666">หมวด: ${book.category} | ปี: ${book.year}</small></td>
                <td>${book.author}</td>
                <td><span class="badge ${statusClass}">${book.status}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="setupEdit(${JSON.stringify(book).borderClean()})">แก้ไข</button>
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">ลบ</button>
                </td>
            `;
            bookList.appendChild(tr);
        });
    } catch (err) {
        console.error('Error fetching books:', err);
    }
}

// ช่วยจัดการแปลงข้อความ JSON เพื่อส่งเข้าปุ่มแก้ไขได้ไม่พัง
String.prototype.borderClean = function() {
    return this.replace(/"/g, '&quot;');
};

// ฟังก์ชัน: ส่งข้อมูลฟอร์ม ไปบันทึกหรืออัปเดต (POST / PUT)
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('book-id').value;
    const bookData = {
        isbn: document.getElementById('isbn').value,
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        category: document.getElementById('category').value,
        year: parseInt(document.getElementById('year').value),
        status: document.getElementById('status').value
    };

    try {
        let response;
        if (isEditing) {
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        }

        if (response.ok) {
            resetForm();
            fetchBooks();
        }
    } catch (err) {
        console.error('Error saving book:', err);
    }
});

// ฟังก์ชัน: เตรียมค่าใส่ฟอร์มเวลากดแก้ไข
window.setupEdit = function(book) {
    isEditing = true;
    formTitle.innerText = '📝 แก้ไขข้อมูลหนังสือ';
    btnSubmit.innerText = 'อัปเดต';
    btnCancel.style.display = 'inline-block';

    document.getElementById('book-id').value = book.id;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('category').value = book.category;
    document.getElementById('year').value = book.year;
    document.getElementById('status').value = book.status;
}

// ฟังก์ชัน: ลบข้อมูลหนังสือ (DELETE)
window.deleteBook = async function(id) {
    if (!confirm('คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchBooks();
    } catch (err) {
        console.error('Error deleting book:', err);
    }
}

btnCancel.addEventListener('click', resetForm);

function resetForm() {
    isEditing = false;
    formTitle.innerText = '➕ เพิ่มหนังสือใหม่';
    btnSubmit.innerText = 'บันทึก';
    btnCancel.style.display = 'none';
    bookForm.reset();
    document.getElementById('book-id').value = '';
}

// เริ่มต้นรันให้ดึงข้อมูลทันทีเมื่อโหลดหน้าเว็บสำเร็จ
document.addEventListener('DOMContentLoaded', fetchBooks);