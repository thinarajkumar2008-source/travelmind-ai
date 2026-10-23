import sqlite3
import os
import math
import unicodedata
from typing import List, Dict, Any, Optional, Tuple
from backend.database.seed_data import (
    COUNTRIES_SEED,
    REGIONS_SEED,
    LOCATIONS_SEED,
    DESTINATIONS_SEED,
)

DB_PATH = os.path.join(os.path.dirname(__file__), "geo_database.sqlite")

def normalize_text(text: str) -> str:
    """Normalize text by converting to lowercase and stripping accents/diacritics."""
    if not text:
        return ""
    normalized = unicodedata.normalize("NFKD", text)
    stripped = "".join(c for c in normalized if not unicodedata.combining(c))
    return stripped.lower().strip()

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance in kilometers between two points on Earth."""
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class GeoDatabase:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        # Register haversine SQLite custom function for spatial queries
        conn.create_function("haversine", 4, haversine_distance)
        return conn

    def _init_db(self):
        """Create tables and indexes if they don't exist and seed default global datasets."""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # 1. Countries table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS countries (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    iso2 TEXT NOT NULL UNIQUE,
                    iso3 TEXT NOT NULL UNIQUE,
                    capital TEXT,
                    continent TEXT NOT NULL,
                    region TEXT,
                    currency_code TEXT,
                    languages TEXT,
                    flag_url TEXT,
                    flag_emoji TEXT,
                    latitude REAL,
                    longitude REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            cursor.execute("CREATE INDEX IF NOT EXISTS idx_countries_continent ON countries(continent);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_countries_iso2 ON countries(iso2);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name);")

            # 2. Administrative Regions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS administrative_regions (
                    id TEXT PRIMARY KEY,
                    country_id TEXT NOT NULL,
                    parent_region_id TEXT,
                    name TEXT NOT NULL,
                    region_code TEXT,
                    region_type TEXT DEFAULT 'State',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(country_id) REFERENCES countries(id) ON DELETE CASCADE,
                    FOREIGN KEY(parent_region_id) REFERENCES administrative_regions(id) ON DELETE SET NULL
                );
            """)

            cursor.execute("CREATE INDEX IF NOT EXISTS idx_regions_country_id ON administrative_regions(country_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_regions_name ON administrative_regions(name);")

            # 3. Locations table (Cities, Towns, Villages, Settlements)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS locations (
                    id TEXT PRIMARY KEY,
                    country_id TEXT NOT NULL,
                    administrative_region_id TEXT,
                    parent_location_id TEXT,
                    name TEXT NOT NULL,
                    normalized_name TEXT NOT NULL,
                    location_type TEXT NOT NULL DEFAULT 'city',
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    population INTEGER,
                    timezone TEXT,
                    data_source TEXT DEFAULT 'GeoNames',
                    external_source_id TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(country_id) REFERENCES countries(id) ON DELETE CASCADE,
                    FOREIGN KEY(administrative_region_id) REFERENCES administrative_regions(id) ON DELETE SET NULL,
                    FOREIGN KEY(parent_location_id) REFERENCES locations(id) ON DELETE SET NULL
                );
            """)

            cursor.execute("CREATE INDEX IF NOT EXISTS idx_locations_country_id ON locations(country_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_locations_region_id ON locations(administrative_region_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_locations_normalized ON locations(normalized_name);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations(latitude, longitude);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(location_type);")

            # 4. Travel Destinations table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS travel_destinations (
                    id TEXT PRIMARY KEY,
                    location_id TEXT,
                    destination_name TEXT NOT NULL,
                    description TEXT,
                    category TEXT DEFAULT 'Attraction',
                    best_visit_season TEXT,
                    estimated_visit_duration TEXT,
                    image_url TEXT,
                    verified_status INTEGER DEFAULT 1,
                    source TEXT DEFAULT 'GeoNames/OSM',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(location_id) REFERENCES locations(id) ON DELETE SET NULL
                );
            """)

            cursor.execute("CREATE INDEX IF NOT EXISTS idx_destinations_location_id ON travel_destinations(location_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_destinations_category ON travel_destinations(category);")

            # Check if countries need seeding
            cursor.execute("SELECT COUNT(*) FROM countries")
            count = cursor.fetchone()[0]
            if count == 0:
                self._seed_initial_data(cursor)
                conn.commit()

    def _seed_initial_data(self, cursor: sqlite3.Cursor):
        """Seed initial 115+ countries, regions, locations, and destinations."""
        for c in COUNTRIES_SEED:
            cursor.execute("""
                INSERT OR IGNORE INTO countries (
                    id, name, iso2, iso3, capital, continent, region,
                    currency_code, languages, flag_emoji, latitude, longitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c["id"], c["name"], c["iso2"], c["iso3"], c["capital"],
                c["continent"], c["region"], c["currency_code"], c["languages"],
                c["flag_emoji"], c["latitude"], c["longitude"]
            ))

        for r in REGIONS_SEED:
            cursor.execute("""
                INSERT OR IGNORE INTO administrative_regions (
                    id, country_id, name, region_code, region_type
                ) VALUES (?, ?, ?, ?, ?)
            """, (r["id"], r["country_id"], r["name"], r["region_code"], r["region_type"]))

        for l in LOCATIONS_SEED:
            cursor.execute("""
                INSERT OR IGNORE INTO locations (
                    id, country_id, administrative_region_id, name, normalized_name,
                    location_type, latitude, longitude, population, timezone,
                    data_source, external_source_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                l["id"], l["country_id"], l.get("administrative_region_id"),
                l["name"], l["normalized_name"], l["location_type"],
                l["latitude"], l["longitude"], l.get("population"),
                l.get("timezone"), l.get("data_source", "GeoNames"),
                l.get("external_source_id")
            ))

        for d in DESTINATIONS_SEED:
            cursor.execute("""
                INSERT OR IGNORE INTO travel_destinations (
                    id, location_id, destination_name, description,
                    category, best_visit_season, estimated_visit_duration,
                    image_url, verified_status, source
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                d["id"], d.get("location_id"), d["destination_name"],
                d.get("description"), d.get("category", "Attraction"),
                d.get("best_visit_season"), d.get("estimated_visit_duration"),
                d.get("image_url"), 1 if d.get("verified_status", True) else 0,
                d.get("source", "GeoNames/OSM")
            ))

    # --- QUERY METHODS ---

    def get_countries(
        self,
        continent: Optional[str] = None,
        query: Optional[str] = None,
        limit: int = 150,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            sql = "SELECT * FROM countries WHERE 1=1"
            params: List[Any] = []

            if continent:
                sql += " AND LOWER(continent) = LOWER(?)"
                params.append(continent)

            if query:
                sql += " AND (LOWER(name) LIKE ? OR LOWER(iso2) = ? OR LOWER(iso3) = ?)"
                wildcard = f"%{query.lower()}%"
                params.extend([wildcard, query.lower(), query.lower()])

            sql += " ORDER BY name ASC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            cursor.execute(sql, params)
            return [dict(row) for row in cursor.fetchall()]

    def get_country_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM countries 
                WHERE LOWER(id) = LOWER(?) OR LOWER(iso2) = LOWER(?) OR LOWER(iso3) = LOWER(?)
            """, (code, code, code))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_country_regions(self, country_code: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT ar.* FROM administrative_regions ar
                JOIN countries c ON ar.country_id = c.id
                WHERE LOWER(c.id) = LOWER(?) OR LOWER(c.iso2) = LOWER(?)
                ORDER BY ar.name ASC
            """, (country_code, country_code))
            return [dict(row) for row in cursor.fetchall()]

    def search_locations(
        self,
        query: str,
        country_code: Optional[str] = None,
        region_id: Optional[str] = None,
        location_type: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> Tuple[List[Dict[str, Any]], int]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            normalized = normalize_text(query)

            where_clauses = ["1=1"]
            params: List[Any] = []

            if normalized:
                where_clauses.append("(l.normalized_name LIKE ? OR l.name LIKE ?)")
                params.extend([f"%{normalized}%", f"%{query}%"])

            if country_code:
                where_clauses.append("(LOWER(l.country_id) = LOWER(?))")
                params.append(country_code)

            if region_id:
                where_clauses.append("l.administrative_region_id = ?")
                params.append(region_id)

            if location_type:
                where_clauses.append("l.location_type = ?")
                params.append(location_type)

            where_sql = " AND ".join(where_clauses)

            # Count total matching
            cursor.execute(f"SELECT COUNT(*) FROM locations l WHERE {where_sql}", params)
            total = cursor.fetchone()[0]

            # Fetch paginated results with country and region names
            sql = f"""
                SELECT l.*, c.name as country_name, c.flag_emoji, ar.name as region_name
                FROM locations l
                JOIN countries c ON l.country_id = c.id
                LEFT JOIN administrative_regions ar ON l.administrative_region_id = ar.id
                WHERE {where_sql}
                ORDER BY 
                    CASE 
                        WHEN l.normalized_name = ? THEN 1
                        WHEN l.normalized_name LIKE ? THEN 2
                        ELSE 3
                    END,
                    COALESCE(l.population, 0) DESC,
                    l.name ASC
                LIMIT ? OFFSET ?
            """
            order_params = [normalized, f"{normalized}%"]
            cursor.execute(sql, params + order_params + [limit, offset])
            results = [dict(row) for row in cursor.fetchall()]

            return results, total

    def get_location_by_id(self, location_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT l.*, c.name as country_name, c.flag_emoji, c.continent, ar.name as region_name
                FROM locations l
                JOIN countries c ON l.country_id = c.id
                LEFT JOIN administrative_regions ar ON l.administrative_region_id = ar.id
                WHERE l.id = ?
            """, (location_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_location_children(self, parent_location_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM locations
                WHERE parent_location_id = ?
                ORDER BY COALESCE(population, 0) DESC, name ASC
            """, (parent_location_id,))
            return [dict(row) for row in cursor.fetchall()]

    def get_nearby_locations(
        self,
        lat: float,
        lon: float,
        radius_km: float = 100.0,
        limit: int = 15,
        location_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            # Bounding box pre-filter for performance
            lat_delta = radius_km / 111.0
            lon_delta = radius_km / (111.0 * max(0.1, math.cos(math.radians(lat))))

            inner_where = ["l.latitude BETWEEN ? AND ?", "l.longitude BETWEEN ? AND ?"]
            params: List[Any] = [lat, lon, lat - lat_delta, lat + lat_delta, lon - lon_delta, lon + lon_delta]

            if location_type:
                inner_where.append("l.location_type = ?")
                params.append(location_type)

            inner_where_sql = " AND ".join(inner_where)

            sql = f"""
                SELECT * FROM (
                    SELECT l.*, c.name as country_name, c.flag_emoji, ar.name as region_name,
                           haversine(?, ?, l.latitude, l.longitude) as distance_km
                    FROM locations l
                    JOIN countries c ON l.country_id = c.id
                    LEFT JOIN administrative_regions ar ON l.administrative_region_id = ar.id
                    WHERE {inner_where_sql}
                ) sub
                WHERE sub.distance_km <= ?
                ORDER BY sub.distance_km ASC
                LIMIT ?
            """
            cursor.execute(sql, params + [radius_km, limit])
            return [dict(row) for row in cursor.fetchall()]

    def search_destinations(self, query: str = "", limit: int = 15) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            sql = """
                SELECT td.*, l.name as city_name, l.latitude, l.longitude,
                       c.name as country_name, c.flag_emoji
                FROM travel_destinations td
                LEFT JOIN locations l ON td.location_id = l.id
                LEFT JOIN countries c ON l.country_id = c.id
            """
            params: List[Any] = []
            if query:
                sql += " WHERE td.destination_name LIKE ? OR td.description LIKE ? OR c.name LIKE ?"
                wildcard = f"%{query}%"
                params.extend([wildcard, wildcard, wildcard])

            sql += " ORDER BY td.destination_name ASC LIMIT ?"
            params.append(limit)

            cursor.execute(sql, params)
            return [dict(row) for row in cursor.fetchall()]

    def get_database_stats(self) -> Dict[str, Any]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM countries")
            total_countries = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM administrative_regions")
            total_regions = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM locations")
            total_locations = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM locations WHERE location_type = 'village'")
            total_villages = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM travel_destinations")
            total_destinations = cursor.fetchone()[0]

            cursor.execute("SELECT continent, COUNT(*) FROM countries GROUP BY continent")
            continent_breakdown = {row[0]: row[1] for row in cursor.fetchall()}

            return {
                "total_countries": total_countries,
                "total_administrative_regions": total_regions,
                "total_locations": total_locations,
                "total_villages": total_villages,
                "total_travel_destinations": total_destinations,
                "continent_breakdown": continent_breakdown,
                "sources": [
                    {
                        "name": "GeoNames",
                        "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
                        "url": "https://www.geonames.org/"
                    },
                    {
                        "name": "OpenStreetMap",
                        "license": "Open Data Commons Open Database License (ODbL)",
                        "url": "https://www.openstreetmap.org/copyright"
                    },
                    {
                        "name": "REST Countries",
                        "license": "Mozilla Public License 2.0 (MPL 2.0)",
                        "url": "https://restcountries.com/"
                    }
                ]
            }

geo_db = GeoDatabase()
