from fastapi import APIRouter
from backend.models import GenerateItineraryRequest, CalculateBudgetRequest

router = APIRouter(prefix="/planner", tags=["planner"])

@router.post("/itinerary")
async def generate_itinerary(req: GenerateItineraryRequest):
    days = []
    for i in range(1, req.durationDays + 1):
        days.append({
            "dayNumber": i,
            "title": f"Day {i}: Immersive Discovery",
            "morningActivity": "Scenic morning plantation trek & fresh tea tasting",
            "afternoonActivity": "Visit historical sanctuary & lakeside viewpoints",
            "eveningActivity": "Sunset viewpoint overlooking misty mountain valleys",
            "recommendedRestaurant": "Saravana Bhavan or Rapsy Restaurant",
            "estimatedDailyExpense": 40 * req.travelersCount
        })

    rate_per_day = 160 if req.budgetCategory == "luxury" else 50 if req.budgetCategory == "budget" else 90
    total = rate_per_day * req.durationDays * req.travelersCount

    return {
        "id": f"itin-{req.destinationId}",
        "destinationId": req.destinationId,
        "destinationName": req.destinationName,
        "durationDays": req.durationDays,
        "travelersCount": req.travelersCount,
        "days": days,
        "totalEstimatedCost": total,
        "currency": "USD"
    }

@router.post("/budget")
async def calculate_budget(req: CalculateBudgetRequest):
    multipliers = {
        "budget": {"hotel": 25, "food": 15, "transport": 10, "sightseeing": 8, "misc": 5},
        "moderate": {"hotel": 65, "food": 30, "transport": 22, "sightseeing": 18, "misc": 12},
        "luxury": {"hotel": 160, "food": 70, "transport": 50, "sightseeing": 40, "misc": 30}
    }
    rates = multipliers.get(req.tier, multipliers["moderate"])
    rooms = max(1, req.travelersCount // 2)
    hotel = rates["hotel"] * req.durationDays * rooms
    food = rates["food"] * req.durationDays * req.travelersCount
    transport = rates["transport"] * req.durationDays * req.travelersCount
    sightseeing = rates["sightseeing"] * req.durationDays * req.travelersCount
    misc = rates["misc"] * req.durationDays * req.travelersCount

    total = hotel + food + transport + sightseeing + misc
    per_person = int(total / req.travelersCount) if req.travelersCount > 0 else total

    return {
        "destinationId": req.destinationId,
        "destinationName": req.destinationName,
        "durationDays": req.durationDays,
        "travelersCount": req.travelersCount,
        "currency": req.currency,
        "tier": req.tier,
        "breakdown": {
            "accommodation": hotel,
            "food": food,
            "localTransport": transport,
            "sightseeing": sightseeing,
            "miscellaneous": misc
        },
        "totalBudget": total,
        "perPersonBudget": per_person,
        "moneySavingTips": [
            "Book eco-lodges or licensed homestays for authentic cultural immersion at lower rates.",
            "Hire a pre-negotiated round-trip vehicle instead of paying multiple short taxi surcharges.",
            "Sample traditional plantation meals and regional thalis."
        ]
    }
