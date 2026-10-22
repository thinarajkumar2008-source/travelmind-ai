# 🌍 TRAVELMIND AI — Premium AI Travel Discovery Platform

> **"Every Journey Has a Story. Discover Where It Leads."**
> 
> *Turn travel videos into destination discoveries. Explore remarkable places, find nearby attractions, and plan your next adventure with TRAVELMIND AI.*

---

## 💎 Zero-Cost Guarantee (₹0 Budget Commitment)

TravelMind AI was architected from the ground up for students, independent developers, and budget-conscious travelers with a strict **₹0 spending limit**:

- **Interactive Maps**: Powered by **Leaflet & OpenStreetMap** (100% Free, MIT licensed, open geographic tiles). **No Google Maps Platform billing, no credit card required.**
- **Routing & Directions**: Uses free **OpenStreetMap Directions** routing.
- **Geocoding**: Open-source **Nominatim API** with throttled caching.
- **Database & Auth**: Runs out of the box in **Zero-Config Local Development Mode** with client-side persistence and one-click demo access (`Alex Vance`), and seamlessly connects to **Supabase's generous Free Tier** (PostgreSQL + Auth + Storage).
- **AI Video Pipeline**: Works offline with a deterministic landmark recognition fallback, and supports the **Google Gemini API Free Tier** (15 RPM / 1M TPM free quota) without enabling paid Google Cloud billing.

---

## 🌟 Key Features

1. **AI Video Understanding & Landmark Extraction**
   - Drag-and-drop video upload workspace (MP4, WebM, MOV) up to 500MB with real-time video player preview.
   - Public video URL input (YouTube Shorts, Instagram Reels, TikTok) with fair-use and platform policy disclosures.
   - Manual destination search with autocomplete suggestions for users who prefer searching directly without video.
   - Honest uncertainty modeling: Never fabricates location certainty; displays confidence score ranking, landmark cues, and alternative candidates.

2. **Interactive Leaflet & OpenStreetMap Integration**
   - Full-bleed geographical exploration at `/explore-map` and embedded maps on destination guides and dashboards.
   - Custom color-coded SVG marker pins:
     - 📍 **Destinations** (Turquoise glowing pin)
     - 📷 **Attractions** (Sunset-orange / amber pin)
     - 🏨 **Hotels** (Indigo / purple bed pin)
     - 🍴 **Dining** (Emerald fork & knife pin)
     - 💖 **Saved Places** (Rose heart pin)
   - Interactive popups with photos, category tags, ratings, OpenStreetMap directions links, and bookmarking.

3. **Complete Cinematic Travel Guides**
   - Detailed destination intelligence for Munnar, Bali, Kyoto, and global destinations.
   - Historical background, cultural significance, climate and seasonal temperature charts.
   - Practical traveler info: Entry fees, transport hubs, accessibility notes, and road safety warnings.
   - Contextual AI Concierge assistant for instant local advice.

4. **Curated Places & Real Search Links**
   - **Hotels & Resorts**: Category filters (Luxury, Resort, Homestay, Boutique), verified ratings, amenities, distances, and free external search links (Booking.com search queries without paid APIs).
   - **Restaurants & Dining**: Regional cuisines, pure-vegetarian toggles, meal cost estimates for two, and signature dishes.
   - **Nearby Tourist Attractions**: Distance and driving times, family-friendly badges, and opening hours.

5. **Smart Travel Itinerary Planner**
   - Interactive destination selector, customizable duration (1 to 7 days), travelers count, and travel pace (Relaxed, Moderate, Packed).
   - Day-by-day morning, afternoon, and evening timelines.
   - **Route on OpenStreetMap**: Visualize all trip stops directly on the interactive map.
   - Personal travel notes editor and one-click Print / PDF export.

6. **Dynamic Travel Budget Calculator**
   - Sliders for trip duration, group size, and travel tier (Budget, Moderate, Luxury).
   - Visual category allocation bars (lodging, dining, transport, sightseeing, misc) in USD, EUR, GBP, INR, JPY, and AUD.

7. **User Dashboard & Saved Trips**
   - Dynamic user statistics based on actual saved trips and video discoveries.
   - Interactive travel map of user's saved bucket list.
   - Fully persistent across page refreshes in both local mode and Supabase cloud mode.

---

## 🏗️ Free Technology Stack

| Layer | Tool / Library | Cost | Role |
|---|---|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite | **₹0 (Open Source)** | Modern, ultra-fast client-side application |
| **Mapping Engine** | Leaflet 1.9 + OpenStreetMap | **₹0 (Open Source)** | Interactive maps without Google Maps billing |
| **Geocoding** | Nominatim (OpenStreetMap) | **₹0 (Free Public API)** | Place searching and coordinate lookup |
| **Styling** | Tailwind CSS v4 | **₹0 (Open Source)** | Deep midnight navy, turquoise, and sunset accents |
| **Animations** | Framer Motion | **₹0 (Open Source)** | Smooth page transitions and modal overlays |
| **Icons** | Lucide React | **₹0 (Open Source)** | Clean, lightweight travel iconography |
| **Backend API** | Python 3.12 + FastAPI + Uvicorn | **₹0 (Open Source)** | High-performance asynchronous REST API |
| **Database & Auth** | Supabase Free Plan / LocalStorage | **₹0 (Free Tier / Offline)** | PostgreSQL, Auth, and Storage with RLS |
| **AI Integration** | Google Gemini 1.5 Flash (Free Tier) | **₹0 (Free Allowance)** | Multimodal video recognition & travel Q&A |

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js**: v18+ and `npm`
- **Python**: v3.11 or v3.12

### 2. Start the Frontend Dev Server
```bash
cd travelmind-ai
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Start the FastAPI Backend Server
```bash
cd travelmind-ai
# In PowerShell:
& "C:\Users\<YourUser>\AppData\Local\Programs\Python\Python312\python.exe" -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
# Or in standard bash/terminal:
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
- API Docs (Swagger UI): **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**
- Health Check: **[http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)**

---

## 🧪 Verification & Automated Testing

### 1. Frontend Production Build Check
```bash
npm run build
```
*(Transpiles and bundles cleanly in < 1 second with 0 TypeScript or CSS errors).*

### 2. Backend Automated Test Suite
```bash
python -m pytest backend/tests/
```
*(Runs 10 automated unit and integration tests covering API endpoints, mock database, and guide generation).*

---

## 📄 License & Attribution

- **OpenStreetMap**: Map data &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- **Leaflet**: Licensed under BSD 2-Clause.
- **TravelMind AI**: Built with 100% free and open-source software for educational and personal travel discovery.
