# Taktivent

Taktivent is a real time feedback app for performers. This app will resolve all pains which performers have when they organize concerts or events. Performer can make an event page instead of making paper flyer and this flyer page will change to an events programme when event starts. Performer can set any questions they would like to ask to the audience in advance. This app will aggreagte ratings and data from the audience.

## Tech Stack

| Item | Technology |
|------|------------|
| Backend | Rails 7 API + Ruby 3.1.2 |
| Frontend | React 19 + TypeScript + Vite |
| State Management | TanStack Query + Zustand |
| Styling | Tailwind CSS |
| Authentication | Devise + JWT |
| Database | PostgreSQL |

## Project Structure

```
taktivent/
├── api/          # Rails 7 API
└── frontend/     # React App
```

## Features

- User registration & login (JWT authentication)
- Event CRUD
- Song CRUD
- Custom question creation
- Anonymous review submission
- Analytics dashboard (rating distribution, sentiment analysis)
- QR code generation
- Countdown timer

## Setup

### Requirements

- Ruby 3.1.2+
- Node.js 20+
- PostgreSQL 14+

### Backend

```bash
cd api
bundle install
rails db:create db:migrate
rails s -p 3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### api/.env

```env
DATABASE_URL=postgres://localhost/taktivent_dev
CLOUDINARY_URL=cloudinary://...
DEVISE_JWT_SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### frontend/.env

```env
VITE_API_URL=http://localhost:3001/api/v1
```

## Testing

```bash
# Backend
cd api && bundle exec rspec

# Frontend
cd frontend && npm test
```
