# Telebox

A privacy-focused cloud storage solution that uses Telegram as the storage backend. Get unlimited file storage with a familiar Google Drive-like interface — your files stay in your own Telegram account.

## Why Telebox?

- **Unlimited Storage** — Telegram provides unlimited cloud storage (2GB per file, 4GB with Premium)
- **Privacy First** — Files are stored in your personal Telegram "Saved Messages", not on third-party servers
- **Zero Storage Costs** — No monthly fees for storage space
- **Familiar Interface** — Google Drive-like UI with Finder-inspired aesthetics

## Features

### Core
- Telegram phone authentication
- Upload/download files to your Saved Messages
- Virtual folder organization
- Grid and list view modes
- File search
- Context menu actions (rename, move, delete)

### File Preview
- Image viewer
- Video player
- Audio player
- PDF viewer
- Text file preview

### Import
- Import existing files from Saved Messages
- Import from Telegram groups and private chats
- Sequential import with progress tracking

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   React SPA     │────▶│   NestJS API    │────▶│   Telegram   │
│   (Frontend)    │◀────│   (Backend)     │◀────│   MTProto    │
└─────────────────┘     └────────┬────────┘     └──────────────┘
                                 │
                        ┌────────▼────────┐
                        │   PostgreSQL    │
                        └─────────────────┘
```

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand

**Backend:** NestJS, TypeScript, Prisma, PostgreSQL, GramJS (Telegram MTProto)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Telegram API credentials ([get from my.telegram.org](https://my.telegram.org))

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
DATABASE_URL=postgresql://user:pass@localhost:5432/telebox
JWT_SECRET=your-secret-key
TELEGRAM_API_ID=your-api-id
TELEGRAM_API_HASH=your-api-hash
ENCRYPTION_KEY=32-character-key-for-sessions
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## Telegram Setup

1. Go to https://my.telegram.org
2. Log in with your phone number
3. Navigate to "API development tools"
4. Create a new application
5. Copy `API_ID` and `API_HASH` to your backend `.env`

## Documentation

See the `docs/` folder for detailed documentation:
- [Product Roadmap](docs/20251228_product_roadmap.md)
- [Project Overview](docs/20251228_project_overview.md)
- [Design Guidelines](docs/design-guidelines.md)

## License

MIT
