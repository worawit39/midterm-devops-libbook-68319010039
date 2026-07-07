import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// ตั้งค่าให้เสิร์ฟพอร์ตตรงกับที่คุณใช้ใน Docker
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    host: true
  }
})