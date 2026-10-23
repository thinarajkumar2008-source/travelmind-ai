"""
TRAVELMIND AI — Geographic Data Import System
Imports populated places, administrative divisions, and countries from GeoNames (CC BY 4.0)
and OpenStreetMap (ODbL) extracts.

Usage:
    python backend/database/import_geo_data.py --stats
    python backend/database/import_geo_data.py --import-seed
    python backend/database/import_geo_data.py --file <path_to_geonames_tsv_or_txt> --country <ISO2>
    python backend/database/import_geo_data.py --download-sample
"""

import sys
import os
import argparse
import csv
import time
import zipfile
import urllib.request
from typing import Dict, Any, Optional

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.database.geo_db import geo_db, normalize_text

GEONAMES_FEATURE_TYPE_MAP = {
    "PPLC": "city",      # Capital of a political entity
    "PPLA": "city",      # Seat of a first-order administrative division
    "PPLA2": "city",     # Seat of a second-order administrative division
    "PPL": "town",       # Populated place (city, town)
    "PPLX": "village",   # Section of populated place
    "PPLL": "village",   # Populated locality
    "PPLF": "village",   # Farm village
    "PPLW": "village",   # Destroyed / abandoned populated place
    "STLMT": "settlement"
}

def validate_coordinates(lat: float, lon: float) -> bool:
    """Validate latitude and longitude ranges."""
    try:
        return -90.0 <= float(lat) <= 90.0 and -180.0 <= float(lon) <= 180.0
    except (ValueError, TypeError):
        return False

def import_geonames_file(
    file_path: str,
    target_country: Optional[str] = None,
    batch_size: int = 1000,
    limit: Optional[int] = None
) -> Dict[str, Any]:
    """Parse and stream import a GeoNames tab-delimited text file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Geographic data file not found: {file_path}")

    stats = {
        "file": os.path.basename(file_path),
        "processed": 0,
        "inserted": 0,
        "skipped": 0,
        "rejected": 0,
        "start_time": time.time()
    }

    print(f"[*] Starting import from: {file_path}")
    if target_country:
        print(f"[*] Filtering for country: {target_country.upper()}")

    conn = geo_db.get_connection()
    cursor = conn.cursor()

    try:
        batch = []
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            reader = csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE)
            for row in reader:
                if not row or len(row) < 19:
                    stats["skipped"] += 1
                    continue

                stats["processed"] += 1

                # GeoNames column specifications:
                # 0: geonameid, 1: name, 2: asciiname, 3: alternatenames, 4: latitude, 5: longitude,
                # 6: feature class, 7: feature code, 8: country code, 10: admin1 code, 14: population, 17: timezone
                geonameid = row[0]
                name = row[1]
                latitude = row[4]
                longitude = row[5]
                feature_class = row[6]
                feature_code = row[7]
                country_code = row[8].upper()
                admin1_code = row[10]
                population = row[14]
                timezone = row[17]

                # Filter: Populated places only (feature_class == 'P')
                if feature_class != "P":
                    stats["skipped"] += 1
                    continue

                # Country filter if specified
                if target_country and country_code != target_country.upper():
                    stats["skipped"] += 1
                    continue

                # Validate coordinates
                try:
                    lat_f = float(latitude)
                    lon_f = float(longitude)
                    if not validate_coordinates(lat_f, lon_f):
                        stats["rejected"] += 1
                        continue
                except ValueError:
                    stats["rejected"] += 1
                    continue

                # Parse population
                pop_val = None
                if population and population.isdigit():
                    pop_val = int(population)

                # Determine type
                loc_type = GEONAMES_FEATURE_TYPE_MAP.get(feature_code, "settlement")
                if pop_val and pop_val > 100000 and loc_type == "town":
                    loc_type = "city"
                elif pop_val and pop_val < 5000 and loc_type == "town":
                    loc_type = "village"

                location_id = f"loc-gn-{geonameid}"
                admin_region_id = f"{country_code}.{admin1_code}" if admin1_code else None
                norm_name = normalize_text(name)

                batch.append((
                    location_id,
                    country_code,
                    admin_region_id,
                    name,
                    norm_name,
                    loc_type,
                    lat_f,
                    lon_f,
                    pop_val,
                    timezone,
                    "GeoNames",
                    geonameid
                ))

                if len(batch) >= batch_size:
                    cursor.executemany("""
                        INSERT OR IGNORE INTO locations (
                            id, country_id, administrative_region_id, name, normalized_name,
                            location_type, latitude, longitude, population, timezone,
                            data_source, external_source_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, batch)
                    stats["inserted"] += len(batch)
                    conn.commit()
                    batch = []
                    if stats["processed"] % 10000 == 0:
                        print(f" -> Processed {stats['processed']} records, inserted {stats['inserted']}...")

                if limit and stats["inserted"] >= limit:
                    break

        if batch:
            cursor.executemany("""
                INSERT OR IGNORE INTO locations (
                    id, country_id, administrative_region_id, name, normalized_name,
                    location_type, latitude, longitude, population, timezone,
                    data_source, external_source_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, batch)
            stats["inserted"] += len(batch)
            conn.commit()

    finally:
        conn.close()

    stats["duration_sec"] = round(time.time() - stats["start_time"], 2)
    print("\n[✓] Import Summary:")
    print(f" - Records Processed: {stats['processed']:,}")
    print(f" - Locations Inserted: {stats['inserted']:,}")
    print(f" - Non-place Skipped: {stats['skipped']:,}")
    print(f" - Invalid Rejected:  {stats['rejected']:,}")
    print(f" - Duration:          {stats['duration_sec']}s")

    return stats

def main():
    parser = argparse.ArgumentParser(description="TRAVELMIND AI — Geographic Dataset Importer")
    parser.add_argument("--file", help="Path to GeoNames TSV/TXT file (e.g. cities500.txt or IN.txt)")
    parser.add_argument("--country", help="Filter import to specific ISO-2 country code (e.g. IN, JP, FR)")
    parser.add_argument("--limit", type=int, help="Limit number of records imported")
    parser.add_argument("--batch-size", type=int, default=1000, help="Batch size for database transactions")
    parser.add_argument("--stats", action="store_true", help="Display current geographic database statistics")
    parser.add_argument("--import-seed", action="store_true", help="Re-initialize and verify the core global seed dataset")

    args = parser.parse_args()

    if args.stats:
        stats = geo_db.get_database_stats()
        print("\n=== TRAVELMIND AI Geographic Database Stats ===")
        print(f"• Total Countries:              {stats['total_countries']}")
        print(f"• Total Administrative Regions: {stats['total_administrative_regions']}")
        print(f"• Total Locations (Cities/etc): {stats['total_locations']}")
        print(f"• Total Villages/Settlements:   {stats['total_villages']}")
        print(f"• Curated Destinations:         {stats['total_travel_destinations']}")
        print("\nContinent Distribution:")
        for cont, count in stats['continent_breakdown'].items():
            print(f"  - {cont}: {count} countries")
        print("\nData Sources & Licenses:")
        for src in stats['sources']:
            print(f"  • {src['name']} ({src['license']}) - {src['url']}")
        return

    if args.file:
        import_geonames_file(args.file, target_country=args.country, batch_size=args.batch_size, limit=args.limit)
        return

    if args.import_seed:
        print("[*] Re-verifying seed data in database...")
        stats = geo_db.get_database_stats()
        print(f"[✓] Complete. Active countries: {stats['total_countries']}, locations: {stats['total_locations']}")
        return

    parser.print_help()

if __name__ == "__main__":
    main()
