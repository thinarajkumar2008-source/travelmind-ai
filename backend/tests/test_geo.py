import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_countries_list_has_at_least_100_countries():
    """Requirement: Support at least 100 countries globally."""
    response = client.get("/api/countries")
    assert response.status_code == 200
    countries = response.json()
    assert len(countries) >= 100, f"Expected >= 100 countries, got {len(countries)}"
    
    # Check that required fields are present
    first = countries[0]
    assert "name" in first
    assert "iso2" in first
    assert "iso3" in first
    assert "continent" in first
    assert "flag_emoji" in first
    assert "latitude" in first
    assert "longitude" in first

def test_continent_distribution():
    """Requirement: All 6 major continents must be represented."""
    response = client.get("/api/countries")
    countries = response.json()
    continents = {c["continent"] for c in countries}
    expected_continents = {"Asia", "Europe", "Africa", "North America", "South America", "Oceania"}
    assert expected_continents.issubset(continents), f"Missing continents: {expected_continents - continents}"

def test_get_country_by_code():
    """Retrieve country by ISO-2 or ISO-3 code."""
    # Test India (IN / IND)
    res_in = client.get("/api/countries/IN")
    assert res_in.status_code == 200
    assert res_in.json()["name"] == "India"
    assert res_in.json()["iso3"] == "IND"

    # Test France (FRA)
    res_fr = client.get("/api/countries/FRA")
    assert res_fr.status_code == 200
    assert res_fr.json()["name"] == "France"

    # Test Japan (JP)
    res_jp = client.get("/api/countries/JP")
    assert res_jp.status_code == 200
    assert res_jp.json()["name"] == "Japan"

def test_get_country_regions():
    """Check administrative regions for a country."""
    response = client.get("/api/countries/IN/regions")
    assert response.status_code == 200
    regions = response.json()
    assert len(regions) > 0
    region_names = [r["name"] for r in regions]
    assert "Kerala" in region_names
    assert "Tamil Nadu" in region_names

def test_search_city():
    """Search for major cities."""
    response = client.get("/api/locations/search?q=Kyoto")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("Kyoto" in r["name"] for r in data["results"])

def test_search_village_and_settlement():
    """Requirement: Support searching villages, towns, and smaller settlements."""
    # Search Bibury (Cotswolds village)
    res_bibury = client.get("/api/locations/search?q=Bibury&type=village")
    assert res_bibury.status_code == 200
    data_bibury = res_bibury.json()
    assert len(data_bibury["results"]) >= 1
    assert data_bibury["results"][0]["location_type"] == "village"

    # Search Shirakawa-go
    res_shirakawa = client.get("/api/locations/search?q=Shirakawa")
    assert res_shirakawa.status_code == 200
    assert any("Shirakawa" in r["name"] for r in res_shirakawa.json()["results"])

def test_search_unicode_and_normalized():
    """Requirement: Support Unicode and diacritics normalization."""
    # Search with lower case and stripped characters
    response = client.get("/api/locations/search?q=gordes")
    assert response.status_code == 200
    assert len(response.json()["results"]) >= 1

def test_get_location_by_id():
    """Test direct location lookup."""
    response = client.get("/api/locations/loc-in-munnar")
    assert response.status_code == 200
    loc = response.json()
    assert loc["name"] == "Munnar"
    assert loc["country_name"] == "India"
    assert loc["latitude"] == pytest.approx(10.0889, abs=0.01)

def test_nearby_locations_haversine():
    """Requirement: Proximity queries with Haversine distance calculations."""
    # Near Munnar, Kerala (10.0889, 77.0595)
    response = client.get("/api/locations/nearby?lat=10.0889&lon=77.0595&radius_km=150")
    assert response.status_code == 200
    nearby = response.json()
    assert len(nearby) > 0
    # First item should be Munnar itself or nearby spot with distance < 10 km
    assert nearby[0]["distance_km"] <= 10.0

def test_destinations_search_and_nearby():
    """Test curated travel destinations search and proximity."""
    res_search = client.get("/api/destinations/search?q=Munnar")
    assert res_search.status_code == 200
    dests = res_search.json()
    assert len(dests) >= 1
    assert "Munnar" in dests[0]["destination_name"]

    res_nearby = client.get("/api/destinations/nearby?lat=10.0889&lon=77.0595&limit=3")
    assert res_nearby.status_code == 200
    nearby_dests = res_nearby.json()
    assert len(nearby_dests) >= 1

def test_geo_stats_and_attribution():
    """Requirement: Accurate stats and attribution to GeoNames & OpenStreetMap."""
    response = client.get("/api/geo/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_countries"] >= 100
    assert stats["total_administrative_regions"] >= 20
    assert stats["total_locations"] >= 30
    
    # Check data attribution compliance
    source_names = [s["name"] for s in stats["sources"]]
    assert "GeoNames" in source_names
    assert "OpenStreetMap" in source_names

def test_invalid_country_404():
    """Error handling: 404 for unknown country code."""
    response = client.get("/api/countries/ZZZ")
    assert response.status_code == 404
