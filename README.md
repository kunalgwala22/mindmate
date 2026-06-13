# MindMate AI 🧠💖

> **An AI-powered mental wellness companion that helps students preparing for exams detect stress, discover hidden emotional patterns, and receive personalized support.**

MindMate AI is a full-stack, hackathon-ready application designed to help students preparing for high-pressure competitive exams (like JEE, NEET, CAT, GATE, UPSC, CUET, and Board Exams) manage stress, track mood, and keep an empathetic journaling diary backed by Gemini AI.

---

## 🌟 Key Features

1. **JWT Authentication & Protected Portal**: Secured registration and login flow for personal session protection.
2. **Daily Mood Check-in**: Simplified emoji selector representing current mood (Happy, Good, Neutral, Anxious, Sad, Burned Out).
3. **AI Journal & Empathetic Validation**: Free-form writing area processed by Gemini AI.
4. **Gemini Generative Analysis**: Evaluates diary logs to return:
   - Primary emotion (e.g. Anxiety, Burnout, Overwhelmed)
   - Overall sentiment (Positive/Negative/Neutral)
   - Stress intensity score (0 to 100)
   - Practical, personalized coping recommendations
   - Empathetic digital motivation
5. **Hidden Stress Trigger Detection**: Aggregates repeating stress variables (Physics anxiety, Lack of sleep, Family pressure, peer comparison) across logs and maps them visually by percentage.
6. **AI Wellness Dashboard**: Multi-card grid showing real-time statistics, current status indicators, and Recharts trend visualizations.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite + TypeScript + Tailwind CSS v4), React Router, TanStack Query, Recharts, Framer Motion.
- **Backend**: Node.js (Express + TypeScript).
- **Database**: MariaDB.
- **AI Integration**: Gemini API (model `gemini-1.5-flash` with fallback mock logic for robust presentation stability).

---

## 📁 Project Structure

```text
mindmate-ai/
├── backend/
│   ├── src/
│   │   ├── config/          # MariaDB connection config
│   │   ├── middleware/      # JWT auth filter
│   │   ├── auth/            # Auth controller
│   │   ├── moods/           # Mood controller
│   │   ├── journals/        # Journal controller
│   │   ├── ai/              # Gemini integration service
│   │   ├── dashboard/       # Dashboard controller
│   │   ├── analytics/       # Analytics compiler
│   │   └── app.ts           # Express bootstrapper
│   ├── schema.sql           # Database schema
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Stress/Emotion charts, mood selector
│   │   ├── services/        # Fetch API handler
│   │   ├── pages/           # Landing, Login, Register, Dashboard, Journal
│   │   ├── types/           # TS Interfaces
│   │   ├── App.tsx          # Router setup
│   │   ├── main.tsx         # React DOM bootstrapper
│   │   └── index.css        # Tailwind v4 theme CSS
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quick Start (Docker Compose)

The easiest way to boot the full-stack database, backend, and frontend concurrently is using Docker Compose.

### 1. Set Environment Variables
Copy `.env.example` to `.env` in the root folder and add your Gemini API Key:
```bash
cp .env.example .env
```
Inside `.env`:
```env
GEMINI_API_KEY=AIzaSyYourActualAPIKeyHere
```

### 2. Build and Boot Containers
Run the Docker Compose command:
```bash
docker compose up --build
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **MariaDB Database**: `localhost:3306` (Root user: `root`, Password: `password`)

The database schema (`schema.sql`) will automatically execute on the database container's initial startup.

---

## 🛠 Manual Startup (Without Docker)

### 1. Database Setup
Ensure you have a local instance of MariaDB/MySQL running. Create the database and execute `backend/schema.sql`.

### 2. Run the Backend API
Navigate to the `backend` folder, copy `.env.example` to `.env`, and start development:
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Run the Frontend Client
Navigate to the `frontend` folder and start Vite:
```bash
cd frontend
npm install
npm run dev
```
The client will serve on `http://localhost:5173`.

---

## 🔗 Backend API Catalog

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/auth/register` | Register a new user | No |
| **POST** | `/auth/login` | Login and acquire JWT token | No |
| **POST** | `/moods` | Post daily mood check-in | **Yes** |
| **GET** | `/moods` | Get daily mood history | **Yes** |
| **POST** | `/journals` | Submit journal and trigger Gemini analysis | **Yes** |
| **GET** | `/journals` | Get list of user journals & AI analysis | **Yes** |
| **GET** | `/dashboard` | Get aggregated dashboard metrics & top triggers | **Yes** |
| **GET** | `/analytics` | Get data for stress/mood trend charts | **Yes** |

---

## 🛡 Verification Plan

### Manual Test Run
1. Open `http://localhost:5173` and view the premium gradient Landing Page.
2. Click **Get Started** or **Register Instantly** to create a user profile.
3. Login using your registered credentials.
4. Click **Check-in & Journal Today**.
5. Select a mood (e.g. `Anxious`) and enter a journal entry:
   - *Example*: *"I spent the whole day trying to understand Physics derivations but I feel completely unprepared for tomorrow's Mock test. Everyone in the group is scoring better than me."*
6. Click **Submit to Gemini**.
7. The empathetic response summary loads instantly, highlighting `Physics anxiety` or `Comparison with peers` as a detected stress trigger, calculating a stress score, and displaying localized relaxation tips.
8. Navigate back to the Dashboard to review stress score lines, mood valency lines, and percentages of hidden stress triggers!
