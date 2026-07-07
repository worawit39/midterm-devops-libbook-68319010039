import { createApp } from 'vue'
import App from './App.vue'

// สร้าง Instance ของ Vue App โดยดึง Component หลัก (App.vue) เข้ามาใช้งาน
const app = createApp(App)

// สั่งให้ Vue นำหน้าเว็บไปแสดงผลที่ธาตุ (Element) ที่มี id="app" ในไฟล์ index.html
app.mount('#app')