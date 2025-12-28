# TDrive

A Google Drive-like web application using Telegram as the storage backend.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Telegram API credentials (get from https://my.telegram.org)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit with your credentials
npx prisma migrate dev
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tdrive
JWT_SECRET=your-secret-key
TELEGRAM_API_ID=your-api-id
TELEGRAM_API_HASH=your-api-hash
ENCRYPTION_KEY=32-character-key-for-sessions
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## Features
- Telegram phone authentication
- Upload/download files (stored in Telegram Saved Messages)
- Virtual folder organization
- Grid and list view
- File search
- Context menu actions (rename, move, delete)
