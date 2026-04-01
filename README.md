# ⛳ CharityLinks — Golf Charity Subscription Platform

A full-stack MERN application where golfers track scores, enter monthly prize draws, and support their chosen charities.

---

## 🏗️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Zustand   |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB + Mongoose                      |
| Auth       | JWT + bcryptjs                          |
| Jobs       | node-cron (monthly draw engine)         |
| Security   | Helmet, express-rate-limit, compression |

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Node.js 18+
- MongoDB running locally on port `27017`

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd dh-assignment

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET
```

### 3. Seed the Database

```bash
cd backend

# Seed charities (required)
node scripts/seedCharities.js

# Create admin user
node scripts/seedAdmin.js
# → Email: admin@golfcharity.com / Password: Admin@123
```

### 4. Start Dev Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Visit **http://localhost:5173**

---

## 🐳 Docker (Full Stack)

```bash
# Copy and fill in env vars
cp backend/.env.example backend/.env

# Start all services
docker-compose up -d

# Seed (first time only)
docker exec golf-charity-api node scripts/seedCharities.js
docker exec golf-charity-api node scripts/seedAdmin.js
```

---

## 📁 Project Structure

```
dh-assignment/
├── backend/
│   ├── src/modules/
│   │   ├── auth/          # JWT auth, signup/login
│   │   ├── subscription/  # Stripe-ready subscription logic
│   │   ├── score/         # Score tracking (FIFO, max 5)
│   │   ├── charity/       # Charity selection
│   │   ├── draw/          # Monthly draw engine
│   │   └── admin/         # Admin dashboard & winner verification
│   ├── middlewares/       # auth, subscription, admin guards
│   ├── jobs/              # node-cron draw job
│   ├── scripts/           # DB seeders
│   └── app.js             # Express entry point
│
├── frontend/
│   └── src/
│       ├── pages/         # Landing, Login, Signup, Dashboard, Subscription, Admin, 404
│       ├── components/    # Toast, Skeleton
│       └── store/         # Zustand auth store
│
└── docker-compose.yml
```

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/signup` | — | Register |
| POST | `/api/v1/auth/login` | — | Login |
| GET | `/api/v1/subscription/status` | JWT | Get sub status |
| POST | `/api/v1/subscription/mock-success` | JWT | Activate sub (mock) |
| POST | `/api/v1/score` | JWT + Sub | Submit score |
| GET | `/api/v1/score` | JWT + Sub | Get scores |
| GET | `/api/v1/charity` | — | List charities |
| POST | `/api/v1/charity/select` | JWT | Select charity |
| GET | `/api/v1/draw/results` | — | Latest draw results |
| POST | `/api/v1/draw/trigger` | JWT | Manually trigger draw |
| GET | `/api/v1/admin/dashboard` | JWT + Admin | Admin stats |
| POST | `/api/v1/admin/verify/winner/:id` | JWT + Admin | Verify winner |

---

## 🏆 Platform Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation, Auth (JWT + BCrypt) | ✅ |
| 2 | Subscriptions, Score Engine, Charities | ✅ |
| 3 | Monthly Draw Engine, Cron Jobs, Prize Pools | ✅ |
| 4 | Admin Dashboard, Winner Verification | ✅ |
| 5 | UI Polish, Animations, Toast/Skeleton | ✅ |
| 6 | Security, Indexing, Docker, Deployment Prep | ✅ |

---

## 📝 License
MIT
