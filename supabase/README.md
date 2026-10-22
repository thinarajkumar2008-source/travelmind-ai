# 🚀 Supabase Setup Guide for TravelMind AI

This guide walks you through connecting your **TravelMind AI** website to your real Supabase project.

---

## Step 1: Create a Supabase Project

1. Visit [Supabase Dashboard](https://supabase.com/dashboard) and sign in or create an account.
2. Click **New Project**.
3. Choose an organization, enter a name (e.g. `travelmind-ai`), and set a secure database password.
4. Select your preferred region and click **Create new project**. Wait ~1–2 minutes for the database to provision.

---

## Step 2: Apply the Database Schema & Storage Policies

1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the migration file:
   `supabase/migrations/20250101000000_full_schema.sql`
4. Copy the entire contents and paste them into the SQL Editor.
5. Click **Run** (or press `Ctrl + Enter`).
6. You will see:
   - ✅ 8 tables created: `profiles`, `destinations`, `video_analyses`, `saved_destinations`, `saved_places`, `itineraries`, `travel_budgets`, `user_preferences`.
   - ✅ Row Level Security (RLS) enabled on all user tables with `auth.uid()` policies.
   - ✅ Storage bucket `travel-videos` created with private user folder isolation.
   - ✅ Auth trigger `handle_new_user()` activated to automatically create user profiles upon registration.

---

## Step 3: Configure Environment Variables

### Frontend Configuration (`.env`)
In your project root (`travelmind-ai/.env`):

```ini
# From your Supabase Project Settings > API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your_publishable_anon_key

# Backend URL
VITE_BACKEND_URL=http://localhost:8000
```

### Backend Configuration (`backend/.env`)
In `travelmind-ai/backend/.env`:

```ini
ENVIRONMENT=development

# From Supabase Project Settings > API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...your_anon_key
# Private service role key (NEVER expose to frontend!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your_service_role_key

# PostgreSQL Connection String (Project Settings > Database)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres

# Google Gemini API key (for multimodal video analysis)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Step 4: Verify Database Functionality

1. **Register a User**:
   Navigate to [http://localhost:5173/register](http://localhost:5173/register) and create an account.
   Check **Authentication > Users** in Supabase to see your registered email and UUID.
   Check **Table Editor > profiles** to see your automatic profile record.

2. **Upload & Analyze a Video**:
   Go to [http://localhost:5173/analyze](http://localhost:5173/analyze) and upload a travel video.
   Check **Storage > travel-videos** to see your uploaded file under `{user_id}/{filename}`.
   Check **Table Editor > video_analyses** to see your analysis job and detected destination.

3. **Save Destinations & Places**:
   Visit [http://localhost:5173/destination/munnar](http://localhost:5173/destination/munnar) and click **Save Destination**.
   Visit [http://localhost:5173/hotels?destination=munnar](http://localhost:5173/hotels?destination=munnar) and click the bookmark on any hotel.
   Check **Table Editor > saved_destinations** and **saved_places**.

4. **Multi-User Security Test**:
   Log out, register a second test account, and verify that User B cannot view or delete User A's private videos or saved trips.
