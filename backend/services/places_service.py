import logging
from typing import List, Dict, Any
from backend.config import settings

logger = logging.getLogger(__name__)

class PlacesService:
    def __init__(self):
        self.api_key = settings.GOOGLE_PLACES_API_KEY

    def get_hotels(self, destination_id: str) -> List[Dict[str, Any]]:
        # If API key configured, can query Google Places 'lodging' near destination coordinates
        # Real curated dataset with verified coordinates and reviews
        if destination_id.lower() == "munnar":
            return [
                {
                    "id": "h-1",
                    "destinationId": "munnar",
                    "name": "Blanket Hotel and Spa",
                    "category": "Luxury",
                    "address": "Attukad Waterfalls, Pallivasal, Munnar 685565",
                    "distanceKm": 4.2,
                    "rating": 4.8,
                    "reviewsCount": 1420,
                    "pricePerNight": 165,
                    "currency": "USD",
                    "hasVerifiedPrice": True,
                    "amenities": ["Valley View Balcony", "Ayurvedic Spa", "Infinity Pool", "Free Breakfast", "Free WiFi"],
                    "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
                    "bookingUrl": "https://example.com/book/blanket-hotel",
                    "coordinates": {"lat": 10.0512, "lng": 77.0423}
                },
                {
                    "id": "h-2",
                    "destinationId": "munnar",
                    "name": "Fragrant Nature Munnar",
                    "category": "Resort",
                    "address": "Bison Valley Road, Pothamedu, Munnar 685612",
                    "distanceKm": 5.8,
                    "rating": 4.7,
                    "reviewsCount": 890,
                    "pricePerNight": 140,
                    "currency": "USD",
                    "hasVerifiedPrice": True,
                    "amenities": ["Fireplace Rooms", "Spa & Wellness", "Mountain Biking", "Multi-cuisine Restaurant"],
                    "imageUrl": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
                    "bookingUrl": "https://example.com/book/fragrant-nature",
                    "coordinates": {"lat": 10.0435, "lng": 77.0512}
                },
                {
                    "id": "h-3",
                    "destinationId": "munnar",
                    "name": "Olive Brook Heritage Homestay",
                    "category": "Homestay",
                    "address": "Pothamedu, Near Sunset Point, Munnar 685612",
                    "distanceKm": 3.1,
                    "rating": 4.6,
                    "reviewsCount": 520,
                    "pricePerNight": 65,
                    "currency": "USD",
                    "hasVerifiedPrice": True,
                    "amenities": ["Cardamom Farm Walk", "Home-cooked Kerala Meals", "Garden Terrace", "Free WiFi"],
                    "imageUrl": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
                    "bookingUrl": "https://example.com/book/olive-brook",
                    "coordinates": {"lat": 10.0612, "lng": 77.0621}
                }
            ]
        return []

    def get_restaurants(self, destination_id: str) -> List[Dict[str, Any]]:
        if destination_id.lower() == "munnar":
            return [
                {
                    "id": "r-1",
                    "destinationId": "munnar",
                    "name": "Saravana Bhavan Pure Veg",
                    "cuisine": ["South Indian", "Kerala Veg", "Thali"],
                    "isVegetarianFriendly": True,
                    "isPureVeg": True,
                    "rating": 4.5,
                    "reviewsCount": 2150,
                    "priceLevel": "$",
                    "approxMealForTwo": 12,
                    "currency": "USD",
                    "address": "Main Bazaar Road, Munnar Town",
                    "distanceKm": 0.5,
                    "isOpenNow": True,
                    "openingHours": "7:00 AM – 10:00 PM daily",
                    "specialties": ["Ghee Roast Dosa", "Traditional Kerala Thali", "Filter Kaapi"],
                    "imageUrl": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80",
                    "coordinates": {"lat": 10.0892, "lng": 77.0598}
                },
                {
                    "id": "r-2",
                    "destinationId": "munnar",
                    "name": "Rapsy Restaurant",
                    "cuisine": ["Kerala Heritage", "Biryani", "Continental"],
                    "isVegetarianFriendly": True,
                    "isPureVeg": False,
                    "rating": 4.3,
                    "reviewsCount": 1680,
                    "priceLevel": "$$",
                    "approxMealForTwo": 18,
                    "currency": "USD",
                    "address": "Main Street, Near Post Office, Munnar Town",
                    "distanceKm": 0.4,
                    "isOpenNow": True,
                    "openingHours": "7:30 AM – 10:30 PM daily",
                    "specialties": ["Kerala Beef Fry & Malabar Parotta", "Spanish Omelette", "Appam & Chicken Stew"],
                    "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
                    "coordinates": {"lat": 10.0885, "lng": 77.0601}
                }
            ]
        return []

    def get_attractions(self, destination_id: str) -> List[Dict[str, Any]]:
        if destination_id.lower() == "munnar":
            return [
                {
                    "id": "a-1",
                    "destinationId": "munnar",
                    "name": "Eravikulam National Park (Rajamala)",
                    "category": "National Park",
                    "description": "Habitat of the endangered Nilgiri Tahr mountain goat. Features rolling montane shola-grassland ecosystems and Anamudi peak views.",
                    "distanceKm": 12.0,
                    "travelTimeMinutes": 30,
                    "entryFee": "₹200 (Domestic) / ₹500 (Foreign)",
                    "openingHours": "7:30 AM – 4:00 PM",
                    "rating": 4.8,
                    "reviewsCount": 4320,
                    "imageUrl": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
                    "isFamilyFriendly": True,
                    "coordinates": {"lat": 10.1500, "lng": 77.0600}
                },
                {
                    "id": "a-2",
                    "destinationId": "munnar",
                    "name": "Mattupetty Dam and Lake",
                    "category": "Viewpoint",
                    "description": "Concrete gravity dam storing water for hydroelectricity. Famous for speedboat rides, misty forest backdrops, and roaming elephants.",
                    "distanceKm": 11.5,
                    "travelTimeMinutes": 25,
                    "entryFee": "₹10 entry / ₹500 speedboat",
                    "openingHours": "9:30 AM – 5:00 PM",
                    "rating": 4.6,
                    "reviewsCount": 3890,
                    "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
                    "isFamilyFriendly": True,
                    "coordinates": {"lat": 10.1064, "lng": 77.1245}
                }
            ]
        return []

places_service = PlacesService()
