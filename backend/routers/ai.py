from fastapi import APIRouter
from backend.models import AskAssistantRequest
from backend.services.gemini_service import gemini_service

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/ask")
async def ask_assistant(req: AskAssistantRequest):
    answer = gemini_service.answer_destination_question(req.destination, req.question)
    return {
        "destination": req.destination,
        "question": req.question,
        "answer": answer
    }
