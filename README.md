# 🚗 ParkEase – Smart Parking Management System (MERN Stack)

ParkEase is a full-stack Smart Parking Management System built using the MERN stack.
It provides role-based authentication, parking slot booking, admin & user dashboards,
and a modern UI.

This project is developed as part of an Infosys Internship Project.

---

## 📌 Features Overview

### 🔐 Authentication (Completed)
- Role-based authentication using JWT
- Secure login & registration
- Roles: Admin, User
- Password hashing with bcrypt
- Protected routes (frontend & backend)

### 👤 User Features
- User registration & login
- User dashboard UI
- Active parking session view
- Parking history
- Vehicle management (backend ready)

### 🧑‍💼 Admin Features
- Admin login
- Admin dashboard UI
- View bookings & revenue
- Slot & user management (backend ready)

### 💰 Pricing Logic
- Base charge: ₹50
- Additional charge: ₹100 per hour
- Calculated on slot release

---

## 🏗️ Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- Custom CSS

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT

---

## 📁 Project Structure

ParkEase/
├── backend/
├── frontend/
└── README.md

---

## ⚙️ Backend Setup

1. Install dependencies
```bash
cd backend
npm install
```

2. Create `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret
```

3. Run backend
```bash
npm run dev
```

---

## ⚙️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

---

## 🔗 API Endpoints

POST /api/auth/register  
POST /api/auth/login  
POST /api/slots/create  
GET  /api/slots  
POST /api/bookings/book  
POST /api/bookings/release  

---

## 🚧 Future Enhancements
- Live booking & release logic
- Payment gateway
- Google Maps integration
- Analytics dashboard
- Deployment (Vercel + Render)

---

## 🎓 Internship Context
Built for Infosys Internship Program – 2025

---

## 👨‍💻 Developer
Vaibhav Bhardwaj

---

## 📜 License
Educational & internship use only.
