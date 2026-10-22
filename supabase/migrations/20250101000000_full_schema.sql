-- =============================================================================
-- TravelMind AI — Complete Supabase PostgreSQL Schema & Security Policies
-- Includes:
--   1. profiles
--   2. video_analyses
--   3. destinations
--   4. saved_destinations
--   5. saved_places
--   6. itineraries
--   7. travel_budgets
--   8. user_preferences
--   9. storage bucket: travel-videos
--   10. Row Level Security (RLS) on all user tables with auth.uid() enforcement
--   11. Triggers for automatic user profile & preference initialization
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES (Extends auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    home_city TEXT,
    preferred_language TEXT DEFAULT 'en',
    preferred_currency TEXT DEFAULT 'USD',
    travel_preferences JSONB DEFAULT '{"pace": "moderate", "styles": ["nature", "culture"]}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. DESTINATIONS (Shared directory of identified tourist locations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.destinations (
    id TEXT PRIMARY KEY, -- Slug or normalized ID like 'munnar', 'bali', 'kyoto'
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    state_or_region TEXT,
    city TEXT,
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    source_provider TEXT DEFAULT 'travelmind',
    provider_place_id TEXT,
    destination_details JSONB DEFAULT '{}'::jsonb,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 3. VIDEO_ANALYSES (Video upload & AI destination discovery history)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    video_path TEXT,
    video_url TEXT,
    video_title TEXT,
    original_filename TEXT NOT NULL,
    file_size_bytes BIGINT,
    duration_seconds INTEGER,
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'queued', 'processing', 'completed', 'failed')),
    confidence_score NUMERIC(5, 2),
    primary_destination_id TEXT REFERENCES public.destinations(id) ON DELETE SET NULL,
    destination_name TEXT,
    destination_country TEXT,
    destination_region TEXT,
    analysis_summary TEXT,
    identified_destinations JSONB DEFAULT '[]'::jsonb,
    raw_ai_output JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 4. SAVED_DESTINATIONS (User bucket list destinations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    destination_id TEXT REFERENCES public.destinations(id) ON DELETE CASCADE NOT NULL,
    destination_name TEXT NOT NULL,
    state_or_region TEXT,
    country TEXT NOT NULL,
    cover_image TEXT,
    planned_dates TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_destination UNIQUE (user_id, destination_id)
);

-- -----------------------------------------------------------------------------
-- 5. SAVED_PLACES (Hotels, restaurants, and attractions saved by user)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    destination_id TEXT REFERENCES public.destinations(id) ON DELETE SET NULL,
    provider_place_id TEXT,
    place_name TEXT NOT NULL,
    place_type TEXT NOT NULL CHECK (place_type IN ('hotel', 'restaurant', 'attraction', 'viewpoint')),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    price_level TEXT,
    rating NUMERIC(3, 2),
    provider_data JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_place UNIQUE (user_id, place_name, place_type)
);

-- -----------------------------------------------------------------------------
-- 6. ITINERARIES (Day-by-day travel plans)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    destination_id TEXT REFERENCES public.destinations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_days INTEGER NOT NULL DEFAULT 3,
    number_of_travelers INTEGER NOT NULL DEFAULT 2,
    budget_category TEXT NOT NULL DEFAULT 'moderate' CHECK (budget_category IN ('budget', 'moderate', 'luxury')),
    pace TEXT NOT NULL DEFAULT 'moderate' CHECK (pace IN ('relaxed', 'moderate', 'packed')),
    travel_preferences JSONB DEFAULT '{}'::jsonb,
    itinerary_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_estimated_cost NUMERIC(10, 2),
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 7. TRAVEL_BUDGETS (Trip expense estimates)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.travel_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE SET NULL,
    destination_id TEXT REFERENCES public.destinations(id) ON DELETE SET NULL,
    destination_name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    tier TEXT NOT NULL DEFAULT 'moderate' CHECK (tier IN ('budget', 'moderate', 'luxury')),
    number_of_days INTEGER NOT NULL DEFAULT 3,
    number_of_travelers INTEGER NOT NULL DEFAULT 2,
    accommodation_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    food_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    transport_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    activities_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    miscellaneous_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    per_person_budget NUMERIC(10, 2) NOT NULL DEFAULT 0,
    budget_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 8. USER_PREFERENCES (Travel preferences & appearance)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_travel_style TEXT DEFAULT 'moderate',
    preferred_budget_range TEXT DEFAULT 'moderate',
    preferred_accommodation TEXT DEFAULT 'boutique',
    preferred_activities JSONB DEFAULT '["Nature", "Culture", "Viewpoints"]'::jsonb,
    dietary_preferences JSONB DEFAULT '["Vegetarian Options"]'::jsonb,
    accessibility_preferences JSONB DEFAULT '[]'::jsonb,
    preferred_currency TEXT DEFAULT 'USD',
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. SEED INITIAL VERIFIED DESTINATIONS (Munnar, Bali, Kyoto, Jaipur, Ooty, Goa)
-- -----------------------------------------------------------------------------
INSERT INTO public.destinations (id, name, country, state_or_region, description, latitude, longitude, image_url)
VALUES 
    ('munnar', 'Munnar', 'India', 'Kerala', 'Rolling tea gardens, misty mountains, and serene valleys in the Western Ghats.', 10.0889, 77.0595, 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=1600&q=80'),
    ('bali', 'Bali', 'Indonesia', 'Bali Province', 'Tropical paradise with ancient temples, volcanic peaks, rice terraces, and surf.', -8.4095, 115.1889, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80'),
    ('kyoto', 'Kyoto', 'Japan', 'Kansai', 'Ancient imperial capital with 10,000 shrines, Zen gardens, bamboo forests, and heritage.', 35.0116, 135.7681, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80'),
    ('jaipur', 'Jaipur', 'India', 'Rajasthan', 'The Pink City featuring majestic Rajput forts, ornate palaces, and colorful bazaars.', 26.9124, 75.7873, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=80'),
    ('ooty', 'Ooty', 'India', 'Tamil Nadu', 'The Queen of Hill Stations with Nilgiri toy trains, lakes, and cool weather.', 11.4102, 76.6950, 'https://images.unsplash.com/photo-1574467711890-23e179744e32?w=1600&q=80'),
    ('goa', 'Goa', 'India', 'Goa', 'Sun-kissed beaches, coastal cuisine, and historic Portuguese colonial architecture.', 15.2993, 74.1240, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    country = EXCLUDED.country,
    state_or_region = EXCLUDED.state_or_region,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- -----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Destinations: Globally readable by everyone, modifiable only by service role
CREATE POLICY "Public destinations are readable by everyone" ON public.destinations
    FOR SELECT USING (true);

-- Profiles: Users can only read and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Video Analyses: Users only see and manage their own video scans
CREATE POLICY "Users can view own video analyses" ON public.video_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video analyses" ON public.video_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video analyses" ON public.video_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own video analyses" ON public.video_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Saved Destinations: Strictly isolated to owner
CREATE POLICY "Users can view own saved destinations" ON public.saved_destinations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved destinations" ON public.saved_destinations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved destinations" ON public.saved_destinations
    FOR DELETE USING (auth.uid() = user_id);

-- Saved Places: Hotels, restaurants, attractions
CREATE POLICY "Users can view own saved places" ON public.saved_places
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved places" ON public.saved_places
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved places" ON public.saved_places
    FOR DELETE USING (auth.uid() = user_id);

-- Itineraries: Full CRUD for itinerary owner
CREATE POLICY "Users can view own itineraries" ON public.itineraries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries" ON public.itineraries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries" ON public.itineraries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries" ON public.itineraries
    FOR DELETE USING (auth.uid() = user_id);

-- Travel Budgets: Isolated to owner
CREATE POLICY "Users can view own budgets" ON public.travel_budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON public.travel_budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON public.travel_budgets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON public.travel_budgets
    FOR DELETE USING (auth.uid() = user_id);

-- User Preferences: Isolated to owner
CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 11. AUTOMATIC PROFILE & PREFERENCE INITIALIZATION ON SIGNUP
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name, avatar_url, preferred_language, preferred_currency)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        'en',
        'USD'
    ) ON CONFLICT (id) DO NOTHING;

    -- Create default preferences
    INSERT INTO public.user_preferences (user_id, preferred_travel_style, preferred_currency, theme)
    VALUES (
        new.id,
        'moderate',
        'USD',
        'system'
    ) ON CONFLICT (user_id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 12. STORAGE BUCKET: travel-videos (Private user videos)
-- -----------------------------------------------------------------------------
-- Create the private bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'travel-videos',
    'travel-videos',
    false,
    524288000, -- 500 MB limit
    ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
)
ON CONFLICT (id) DO UPDATE SET 
    public = false,
    file_size_limit = 524288000;

-- Storage RLS: Users can only upload, read, and delete their own files organized by user_id
CREATE POLICY "Users can upload their own travel videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'travel-videos' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own travel videos"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'travel-videos' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own travel videos"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'travel-videos' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);
