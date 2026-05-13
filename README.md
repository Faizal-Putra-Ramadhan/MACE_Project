# MACE - Program Bantuan Pembiayaan Pendidikan

Fullstack application for educational funding assistance in Papua, refactored for Vercel and Supabase.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Supabase Storage
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase PostgreSQL + Sequelize
- **Storage**: Supabase Storage

## Setup Instructions

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the contents of `supabase/seed.sql` to create tables and seed data.
3. Go to **Storage** and create the following public buckets:
   - `dokumen-pendaftaran`
   - `laporan`
   - `foto-profil`
   - `rekening`
4. Go to **Project Settings > API** to get your `SUPABASE_URL`, `ANON_KEY`, and `SERVICE_ROLE_KEY`.

### 2. Environment Variables
Create a `.env` file in the root (and set these in Vercel):
```env
# Database
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_KEY=[service-role-key]

# Auth
JWT_SECRET=your_random_long_secret

# Frontend
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
VITE_API_URL=https://your-app.vercel.app/api
```

### 3. Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Note: To test serverless functions locally, use `vercel dev`.

### 4. Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. Set the environment variables in the Vercel dashboard.
3. Vercel will automatically detect `vercel.json` and deploy both the frontend and the `api/` functions.

## Project Structure
- `/api`: Serverless API handlers.
- `/src`: React frontend source.
- `/lib`: Shared utilities (database, auth, storage).
- `/models`: Sequelize models shared between API functions.
- `/supabase`: SQL seed files.
- `vercel.json`: Root configuration for Vercel.
