# 🏌️‍♂️ Golf Performance & Draw Platform

🔗 **Live App:** https://golf-app-re84.vercel.app/

---

## 📌 Overview

This platform is a **subscription-driven web application** that combines:

- 🏌️ Golf performance tracking  
- 🎁 Monthly draw-based reward system  
- ❤️ Charity contribution integration  

It is designed with a **modern SaaS UI/UX**, focusing on engagement, scalability, and clean user experience.

---

## 🚀 Features

### 👤 User Features

- 🔐 Secure Authentication (Signup/Login)
- 📊 Enter and manage last 5 golf scores (Stableford format)
- 💳 Subscription activation
- ❤️ Select charity & contribution %
- 🎯 Participate in monthly draw
- 🏆 View winnings & leaderboard
- 📜 View draw history

---

### 👑 Admin Features

- ⚡ Admin Dashboard (Dark SaaS UI)
- 🎯 Generate & run draw system
- 💰 Dynamic prize pool calculation
- 📊 Analytics dashboard (users, revenue, winnings)
- 🏆 Winner selection logic (3/4/5 match)
- 📜 Draw history tracking
- 🔐 Role-based access control

---

## 🧠 Core System Logic

### 🎯 Draw Engine

- Random 5-number generation (1–45)
- Match system:
  - 5 Match → Jackpot (40%)
  - 4 Match → 35%
  - 3 Match → 25%
- Prize split among winners

---

### 📊 Score System

- Users can store **only last 5 scores**
- New score replaces oldest automatically
- Range validation: **1–45**

---

### 💰 Prize Pool Logic

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo


git clone <your-repo-link>
cd golf-app


---

### 2️⃣ Install Dependencies


npm install


---

### 3️⃣ Add Environment Variables

Create `.env` file:


VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key


---

### 4️⃣ Run Project


npm run dev


---

## 👤 Test Credentials

### 🔑 Admin
- Email: admin@gmail.com  
- Password: ******  

### 👤 User
- Signup normally  

---

## 📊 Highlights

- Clean architecture  
- Role-based access system  
- Dynamic prize logic  
- Modern SaaS UI  
- Scalable design  
---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo


git clone <your-repo-link>
cd golf-app


---

### 2️⃣ Install Dependencies


npm install


---

### 3️⃣ Add Environment Variables

Create `.env` file:


VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key


---

### 4️⃣ Run Project


npm run dev


---

## 👤 Test Credentials

### 🔑 Admin
- Email: admin@gmail.com  
- Password: ******  

### 👤 User
- Signup normally  

---

## 📊 Highlights

- Clean architecture  
- Role-based access system  
- Dynamic prize logic  
- Modern SaaS UI  
- Scalable design  
