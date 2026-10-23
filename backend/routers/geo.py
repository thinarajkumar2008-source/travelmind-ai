from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from backend.database.geo_db import geo_db

router = APIRouter(prefix="", tags=["geographic-database"])

# --- Response Schemas ---

class CountryResponse(BaseModel):
    id: str
    name: str
    iso2: str
    iso3: str
    capital: Optional[str] = None
    continent: str
    region: Optional[str] = None
    currency_code: Optional[str] = None
    languages: Optional[str] = None
    flag_emoji: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AdministrativeRegionResponse(BaseModel):
    id: str
    country_id: str
    name: str
    region_code: Optional[str] = None
    region_type: str = "State"

class LocationResponse(BaseModel):
    id: str
    country_id: str
    country_name: Optional[str] = None
    flag_emoji: Optional[str] = None
    administrative_region_id: Optional[str] = None
    region_name: Optional[str] = None
    name: str
    location_type: str
    latitude: float
    longitude: float
    population: Optional[int] = None
    timezone: Optional[str] = None
    data_source: str = "GeoNames"
    external_source_id: Optional[str] = None
    distance_km: Optional[float] = None

class LocationSearchResponse(BaseModel):
    query: str
    total: int
    page: int
    limit: int
    results: List[LocationResponse]

class DestinationResponse(BaseModel):
    id: str
    location_id: Optional[str] = None
    destination_name: str
    description: Optional[str] = None
    category: str = "Attraction"
    best_visit_season: Optional[str] = None
    estimated_visit_duration: Optional[str] = None
    image_url: Optional[str] = None
    verified_status: bool = True
    city_name: Optional[str] = None
    country_name: Optional[str] = None
    flag_emoji: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance_km: Optional[float] = None

# --- Endpoints ---

@router.get("/countries", response_model=List[CountryResponse], summary="List supported countries")
async def list_countries(
    continent: Optional[str] = Query(None, description="Filter by continent name (e.g. Asia, Europe)"),
    q: Optional[str] = Query(None, description="Search country by name or ISO code"),
    limit: int = Query(150, ge=1, le=300),
    offset: int = Query(0, ge=0)
):
    """Retrieve all supported countries with metadata, flags, and continent classification."""
    countries = geo_db.get_countries(continent=continent, query=q, limit=limit, offset=offset)
    return countries

@router.get("/countries/{country_code}", response_model=CountryResponse, summary="Get country by code")
async def get_country(country_code: str):
    """Retrieve country details by ISO-2 or ISO-3 alpha code."""
    country = geo_db.get_country_by_code(country_code)
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Country '{country_code}' not found in geographic database."
        )
    return country

@router.get("/countries/{country_code}/regions", response_model=List[AdministrativeRegionResponse], summary="Get administrative regions for a country")
async def get_country_regions(country_code: str):
    """List states, provinces, prefectures, or cantons for a given country."""
    regions = geo_db.get_country_regions(country_code)
    return regions

@router.get("/locations/search", response_model=LocationSearchResponse, summary="Search cities, towns, and villages")
async def search_locations(
    q: str = Query("", description="Location name search term (Unicode supported)"),
    country_code: Optional[str] = Query(None, description="Filter by ISO-2 country code"),
    region_id: Optional[str] = Query(None, description="Filter by administrative region ID"),
    type: Optional[str] = Query(None, description="Filter by type: city, town, village, settlement"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Search populated places across the 100+ countries database.
    Supports server-side filtering, debounced autocomplete, and population sorting.
    """
    results, total = geo_db.search_locations(
        query=q,
        country_code=country_code,
        region_id=region_id,
        location_type=type,
        limit=limit,
        offset=offset
    )

    page = (offset // limit) + 1 if limit > 0 else 1
    return {
        "query": q,
        "total": total,
        "page": page,
        "limit": limit,
        "results": results
    }

@router.get("/locations/nearby", response_model=List[LocationResponse], summary="Find nearby populated places")
async def get_nearby_locations(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude"),
    radius_km: float = Query(100.0, ge=1.0, le=500.0, description="Search radius in kilometers"),
    limit: int = Query(15, ge=1, le=50),
    type: Optional[str] = Query(None, description="Filter by location type: city, town, village")
):
    """
    Calculates geographic proximity using spherical distance (Haversine formula).
    Returns real verified locations sorted from nearest to farthest.
    """
    nearby = geo_db.get_nearby_locations(
        lat=lat,
        lon=lon,
        radius_km=radius_km,
        limit=limit,
        location_type=type
    )
    return nearby

@router.get("/locations/{location_id}", response_model=LocationResponse, summary="Get location details by ID")
async def get_location(location_id: str):
    """Retrieve full location details including parent region, country, and timezone."""
    loc = geo_db.get_location_by_id(location_id)
    if not loc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Location '{location_id}' not found."
        )
    return loc

@router.get("/locations/{location_id}/children", response_model=List[LocationResponse], summary="Get sub-settlements or villages")
async def get_location_children(location_id: str):
    """Retrieve child villages or localities under a parent settlement."""
    children = geo_db.get_location_children(location_id)
    return children

@router.get("/destinations/search", response_model=List[DestinationResponse], summary="Search curated travel destinations")
async def search_travel_destinations(
    q: str = Query("", description="Search destinations by name or country"),
    limit: int = Query(15, ge=1, le=50)
):
    """Search curated global tourist spots and attractions with verified statuses."""
    destinations = geo_db.search_destinations(query=q, limit=limit)
    return destinations

@router.get("/destinations/nearby", response_model=List[DestinationResponse], summary="Nearby travel destinations")
async def get_nearby_destinations(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    limit: int = Query(6, ge=1, le=20)
):
    """Return top travel destinations nearest to the given geographic coordinates."""
    # Retrieve closest locations and join with destination data
    all_dests = geo_db.search_destinations(limit=50)
    for d in all_dests:
        d_lat = d.get("latitude")
        d_lon = d.get("longitude")
        if d_lat is not None and d_lon is not None:
            from backend.database.geo_db import haversine_distance
            d["distance_km"] = round(haversine_distance(lat, lon, d_lat, d_lon), 1)
        else:
            d["distance_km"] = 99999.0

    all_dests.sort(key=lambda x: x.get("distance_km", 99999.0))
    return all_dests[:limit]

@router.get("/geo/stats", summary="Geographic database statistics and licensing attribution")
async def get_geo_stats():
    """Returns actual record counts (countries, regions, locations) and data source licenses."""
    return geo_db.get_database_stats()
