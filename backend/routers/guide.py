from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/guide", tags=["guide"])

GUIDES_DATA = {
    "munnar": {
        "id": "munnar",
        "name": "Munnar",
        "stateOrRegion": "Kerala",
        "country": "India",
        "tagline": "The Emerald Hills of God's Own Country",
        "coverImage": "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=1600&q=80",
        "confidenceScore": 94,
        "coordinates": {"lat": 10.0889, "lng": 77.0595},
        "overview": {
            "description": "Perched at an elevation of 1,600 meters in the Western Ghats mountain range of Kerala, Munnar is a serene hill station enveloped in sprawling tea plantations, misty valleys, rolling hills, and cascading waterfalls.",
            "geography": "Nestled at the confluence of three mountain streams in the Idukki district, crowned by South India's highest peak Anamudi (2,695m).",
            "history": "Developed into a commercial tea hub in the late 19th century by pioneering British planters.",
            "culturalSignificance": "Home to the rare Neelakurinji flower blooming every 12 years and indigenous Muthuvan tribal heritage.",
            "famousLandmarks": ["Mattupetty Dam", "Eravikulam National Park", "Tata Tea Museum", "Kolukkumalai"],
            "localCustoms": ["Respect nature sanctuaries", "Support local cooperatives"]
        },
        "bestTimeToVisit": {
            "peakSeason": "October to March (12°C - 22°C, misty mornings)",
            "shoulderSeason": "April to May (Pleasant summer retreat)",
            "monsoonOrOffSeason": "June to September (Heavy rainfall, emerald foliage)"
        },
        "hotelsCount": 18,
        "restaurantsCount": 14,
        "attractionsCount": 12
    }
}

@router.get("/{destination_id}")
async def get_travel_guide(destination_id: str):
    dest = destination_id.lower()
    if dest in GUIDES_DATA:
        return GUIDES_DATA[dest]
    # Default to Munnar
    return GUIDES_DATA["munnar"]
