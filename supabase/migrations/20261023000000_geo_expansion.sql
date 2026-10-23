-- =============================================================================
-- Migration: 20261023000000_geo_expansion.sql
-- Global Geographic Database Expansion (100+ Countries, Regions, Locations)
-- Sources: GeoNames (CC BY 4.0) & OpenStreetMap (ODbL)
-- =============================================================================

-- 1. COUNTRIES TABLE
CREATE TABLE IF NOT EXISTS public.countries (
    id TEXT PRIMARY KEY, -- ISO alpha-2 code (e.g., 'IN', 'FR', 'US')
    name TEXT NOT NULL,
    iso2 VARCHAR(2) NOT NULL UNIQUE,
    iso3 VARCHAR(3) NOT NULL UNIQUE,
    capital TEXT,
    continent TEXT NOT NULL,
    region TEXT,
    currency_code VARCHAR(10),
    languages TEXT,
    flag_url TEXT,
    flag_emoji VARCHAR(10),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_countries_continent ON public.countries(continent);
CREATE INDEX IF NOT EXISTS idx_countries_iso2 ON public.countries(iso2);
CREATE INDEX IF NOT EXISTS idx_countries_name ON public.countries(name);

-- 2. ADMINISTRATIVE REGIONS TABLE (States, Provinces, Prefectures, Cantons)
CREATE TABLE IF NOT EXISTS public.administrative_regions (
    id TEXT PRIMARY KEY, -- e.g., 'IN.KL', 'US.CA', 'FR.IDF'
    country_id TEXT NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    parent_region_id TEXT REFERENCES public.administrative_regions(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    region_code TEXT,
    region_type TEXT DEFAULT 'State', -- State, Province, Department, Prefecture, Region
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_regions_country_id ON public.administrative_regions(country_id);
CREATE INDEX IF NOT EXISTS idx_regions_name ON public.administrative_regions(name);

-- 3. LOCATIONS TABLE (Cities, Towns, Villages, Settlements)
CREATE TABLE IF NOT EXISTS public.locations (
    id TEXT PRIMARY KEY, -- e.g. 'loc-gn-1263776' or UUID
    country_id TEXT NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    administrative_region_id TEXT REFERENCES public.administrative_regions(id) ON DELETE SET NULL,
    parent_location_id TEXT REFERENCES public.locations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL, -- lowercased, accent-stripped for fast searching
    location_type TEXT NOT NULL DEFAULT 'city', -- city, town, village, settlement
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    population INTEGER,
    timezone TEXT,
    data_source TEXT DEFAULT 'GeoNames', -- GeoNames, OpenStreetMap
    external_source_id TEXT, -- e.g. GeoNames ID or OSM node ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_locations_country_id ON public.locations(country_id);
CREATE INDEX IF NOT EXISTS idx_locations_region_id ON public.locations(administrative_region_id);
CREATE INDEX IF NOT EXISTS idx_locations_name ON public.locations(name);
CREATE INDEX IF NOT EXISTS idx_locations_normalized_name ON public.locations(normalized_name);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON public.locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(location_type);

-- 4. TRAVEL DESTINATIONS TABLE (Curated tourist points of interest)
CREATE TABLE IF NOT EXISTS public.travel_destinations (
    id TEXT PRIMARY KEY,
    location_id TEXT REFERENCES public.locations(id) ON DELETE SET NULL,
    destination_name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Attraction', -- Hill Station, Beach, Cultural, Nature, Historic
    best_visit_season TEXT,
    estimated_visit_duration TEXT,
    image_url TEXT,
    verified_status BOOLEAN DEFAULT true,
    source TEXT DEFAULT 'GeoNames/OSM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_destinations_location_id ON public.travel_destinations(location_id);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON public.travel_destinations(category);

-- Enable RLS for public read access
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrative_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Allow public read access on administrative_regions" ON public.administrative_regions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on travel_destinations" ON public.travel_destinations FOR SELECT USING (true);
