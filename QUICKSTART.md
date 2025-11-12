# PIVORI Studio v2.0 - Quick Start Guide

Get up and running with PIVORI Studio in 5 minutes!

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Supabase account (free tier)
- Vercel account (free tier)

## 1. Clone Repository

```bash
git clone https://github.com/pivori-app/pivori-studio-v2.git
cd pivori-studio-v2
```

## 2. Setup Supabase

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy credentials:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon Key → `VITE_SUPABASE_ANON_KEY`
   - Service Key → `SUPABASE_SERVICE_KEY`

### Run Migrations

```bash
# Using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push

# OR manually in Supabase SQL Editor
# Copy content of backend/migrations.sql and run
```

## 3. Configure Environment

### Frontend (.env.local)

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)

```bash
cd ../backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

## 4. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## 5. Start Development Servers

### Terminal 1 - Backend

```bash
cd backend
npm run dev
# Server running on http://localhost:3000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

## 6. Access Application

Open browser to: **http://localhost:5173**

## 7. Seed Sample Data (Optional)

```bash
cd backend
node seed.mjs
```

This creates:
- Sample user (demo@pivori.com)
- 4 sample applications
- 20 sample transactions
- 8 sample API keys
- 12 sample connectors

## 8. Test API Endpoints

```bash
# Get applications
curl -X GET http://localhost:3000/api/applications \
  -H "Authorization: Bearer <jwt-token>"

# Create application
curl -X POST http://localhost:3000/api/applications \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "description": "Test app",
    "category": "productivity",
    "currency": "EUR"
  }'
```

## 9. Deploy to Vercel (Optional)

### Connect GitHub Repository

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

### Environment Variables for Vercel

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=your-backend-url
```

## 10. Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Supabase Connection Error

- Verify credentials in `.env` files
- Check Supabase project is running
- Ensure migrations are applied

### CORS Error

- Check `FRONTEND_URL` in backend `.env`
- Verify CORS configuration in `server.js`

### JWT Token Error

- Ensure `JWT_SECRET` is set
- Token should be in format: `Bearer <token>`

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Read [API_REFERENCE.md](./API_REFERENCE.md) for API documentation
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines

## Support

- Check [Troubleshooting](./DEPLOYMENT.md#troubleshooting) section
- Open GitHub issue
- Contact: support@pivori.com

---

**Happy coding! 🚀**

