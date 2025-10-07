# 🍳 Recipe App (Monorepo)

A full-stack **Recipe Management Application** built using a **monorepo architecture**, featuring:

- **Frontend:** React.js + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** MySQL

This app enables users to view, add, update, and manage recipes. It demonstrates clean architecture, modular code structure, and TypeScript best practices for both frontend and backend.

---

## 🧩 Project Structure

recipe-app/
│
├── frontend/ # React.js + TypeScript frontend
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── tsconfig.json
│
├── backend/ # Node.js + Express + TypeScript backend
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── models/
│ │ ├── middlewares/
│ │ └── server.ts
│ ├── tsconfig.json
│ └── package.json
│
├── package.json # Root config for concurrently running both apps
└── README.md

---

## ⚙️ Tech Stack

### **Frontend**

- ⚛️ React.js
- 🔷 TypeScript
- 🎨 Material-UI / Tailwind CSS (based on setup)
- 🔄 Axios (for API calls)
- 📦 React Router (for navigation)

### **Backend**

- 🟩 Node.js
- 🚀 Express.js
- 🗄️ MySQL (`mysql2`)
- 🔐 JWT Authentication (`jsonwebtoken`)
- 🔑 Bcrypt (for password hashing)
- 📂 Multer (for file uploads)
- ⚙️ TypeScript, ts-node, and nodemon

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/<your-username>/recipe-app.git
cd recipe-app

```

# From root

cd backend && npm install
cd ../frontend && npm install
cd ..

# db connection

Create a .env file inside the backend/ folder:

PORT=your_PortNo.
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=recipe_db
JWT_SECRET=your_jwt_secret

# Run Backend (Express API)

cd backend
npm run dev

# Run Frontend (React App)

cd ../frontend
npm start

# Run Both Together (Recommended)

You can manage both apps from the root using concurrently.

npm install concurrently --save-dev

✅ This will start both frontend and backend concurrently!
