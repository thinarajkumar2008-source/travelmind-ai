import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_get_guide():
    response = client.get("/api/guide/munnar")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Munnar"
    assert data["country"] == "India"
    assert "overview" in data

def test_get_hotels():
    response = client.get("/api/places/hotels/munnar")
    assert response.status_code == 200
    hotels = response.json()
    assert isinstance(hotels, list)
    assert len(hotels) > 0
    assert hotels[0]["name"] == "Blanket Hotel and Spa"

def test_get_restaurants():
    response = client.get("/api/places/restaurants/munnar")
    assert response.status_code == 200
    restaurants = response.json()
    assert isinstance(restaurants, list)
    assert len(restaurants) > 0

def test_get_attractions():
    response = client.get("/api/places/attractions/munnar")
    assert response.status_code == 200
    attractions = response.json()
    assert isinstance(attractions, list)
    assert len(attractions) > 0

def test_generate_itinerary():
    payload = {
        "destinationId": "munnar",
        "destinationName": "Munnar",
        "durationDays": 3,
        "travelersCount": 2,
        "pace": "moderate",
        "budgetCategory": "moderate"
    }
    response = client.post("/api/planner/itinerary", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["days"]) == 3
    assert data["totalEstimatedCost"] > 0

def test_calculate_budget():
    payload = {
        "destinationId": "munnar",
        "destinationName": "Munnar",
        "durationDays": 4,
        "travelersCount": 2,
        "tier": "moderate",
        "currency": "USD"
    }
    response = client.post("/api/planner/budget", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["totalBudget"] > 0
    assert "breakdown" in data

def test_ai_ask_assistant():
    payload = {
        "destination": "Munnar",
        "question": "What is the best time to visit?"
    }
    response = client.post("/api/ai/ask", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["answer"]) > 10
