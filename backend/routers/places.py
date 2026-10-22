from fastapi import APIRouter
from backend.services.places_service import places_service

router = APIRouter(prefix="/places", tags=["places"])

@router.get("/hotels/{destination_id}")
async def get_hotels(destination_id: str):
    return places_service.get_hotels(destination_id)

@router.get("/restaurants/{destination_id}")
async def get_restaurants(destination_id: str):
    return places_service.get_restaurants(destination_id)

@router.get("/attractions/{destination_id}")
async def get_attractions(destination_id: str):
    return places_service.get_attractions(destination_id)
