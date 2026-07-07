import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 🚨 ใส่บรรทัดนี้เพิ่มเติมเข้าไปเพื่อแก้ปัญหาหน้าจอขาวบน Nginx
  base: './',
  server: {
    port: 8080,
    host: true
  }
})