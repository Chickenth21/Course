# AI-Powered English Learning Platform

A full-stack English learning platform that helps users improve their English through personalized lessons, adaptive exercises, placement assessments, progress tracking, and AI-generated educational content powered by Google Gemini.

---

## 🏗️ Architecture Overview

The system follows a modern decoupled client-server architecture:

```text
Course/
│
├── client/          # Frontend: Vite + React + TypeScript + Tailwind CSS + TanStack Query
├── server/          # Backend: Node.js + Express + TypeScript + Prisma ORM + Zod
├── .agents/         # Agent skills & workflows
└── package.json     # Workspace management & concurrent dev scripts
```

### Key Principles
- **Clean Architecture & Separation of Concerns**: Strict boundary between client, server API, business services, and database repositories.
- **Controlled AI Layer**: Gemini prompts, validation (via Zod schemas), and content storage happen entirely on the server. No direct AI or database calls from the client.
- **Deterministic Scoring**: Deterministic logic for objective questions; Gemini for personalized reasoning, generation, and qualitative insights.

---

## 🚀 Getting Started (Phase 1)

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Installation

Install dependencies across the root, server, and client:

```bash
npm run install:all
```

Or install individually:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Environment Variables

Create `.env` files for both server and client:

**Server (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/english_learning
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Running in Development

Start both server and client concurrently:

```bash
npm run dev
```

Or run them in separate terminals:

```bash
# Terminal 1: Backend Server (http://localhost:5000)
npm run dev:server

# Terminal 2: Frontend Client (http://localhost:5173)
npm run dev:client
```

---

## 📡 API Health Check

Verify backend status:

```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{
  "status": "ok",
  "message": "English Learning Platform API is healthy",
  "timestamp": "2026-08-31T00:00:00.000Z",
  "uptime": 4.12,
  "environment": "development"
}
```

---

## 🛠️ Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs both client and server concurrently in development mode |
| `npm run dev:server` | Starts the Express backend in watch mode using `tsx` |
| `npm run dev:client` | Starts the Vite React frontend dev server |
| `npm run build` | Builds both server and client for production |
| `npm run typecheck` | Runs TypeScript checks on both server and client |
| `npm run install:all` | Installs root, server, and client dependencies |

---

## 🗺️ Implementation Roadmap
- [x] **Phase 1**: Project Setup, Client & Server Foundations, API Health Check
- [ ] **Phase 2**: Database Design, Prisma Schema, Supabase PostgreSQL Integration
- [ ] **Phase 3**: Authentication & Authorization (JWT)
- [ ] **Phase 4**: Placement Assessment & Skill Analysis
- [ ] **Phase 5**: Personalized Learning Path Engine
- [ ] **Phase 6**: Course, Module & Lesson Management
- [ ] **Phase 7**: Server-side Google Gemini AI Integration
- [ ] **Phase 8**: Exercise Engine & Multi-type Question Scoring
- [ ] **Phase 9**: Adaptive Learning & Weakness Detection
- [ ] **Phase 10**: Progress Analytics Dashboard
- [ ] **Phase 11**: UI/UX Refinements
- [ ] **Phase 12**: Automated & Schema Testing
