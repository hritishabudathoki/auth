# ExploreEase

Full-stack monorepo with an Express + MongoDB backend and a Next.js frontend for user registration and login.

## Structure

```
my-auth-app/
├── README.md
├── backend/    # Express + TypeScript + MongoDB API
└── frontend/   # Next.js 16 frontend
```

## Quick start (both servers)

```bash
npm run install:all   # first time only
cd backend && cp .env.example .env && cd ..
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8089](http://localhost:8089)

## Backend only

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Auth endpoints

- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login and receive a JWT

## Frontend only

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

**Backend** (`backend/.env`):

```
PORT=8089
MONGODB_URL=mongodb://localhost:27017/class-36a-db
SECRET_KEY=merosecretkey
```

**Frontend** (`frontend/.env.local`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8089
```
