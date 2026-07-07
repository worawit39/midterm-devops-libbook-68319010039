FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

# 🚨 เช็กตรงนี้: ต้องมีบรรทัดนี้แค่บรรทัดเดียวที่ล่างสุด ห้ามมี CMD อื่นซ้ำ
CMD ["node", "index.js"]