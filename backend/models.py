from typing import List, Optional
from pydantic import BaseModel, Field

class Coordinates(BaseModel):
    lat: float
    lng: float

class DestinationCandidateModel(BaseModel):
    id: str
    name: str
    stateOrRegion: str
    country: str
    confidence: int
    confidenceLevel: str
    summary: str
    detectedLandmarks: List[str] = []
    visualClues: List[str] = []
    textOrSignsDetected: List[str] = []
    audioEvidence: Optional[str] = None
    imageUrl: str
    coordinates: Coordinates
    isConfirmed: bool = False

class AnalysisDetailsModel(BaseModel):
    framesAnalyzed: int = 120
    landmarksCount: int = 2
    speechDetected: bool = False
    sceneryTypes: List[str] = []

class VideoAnalysisJobModel(BaseModel):
    id: str
    videoUrl: Optional[str] = None
    videoFileName: str
    videoFileSize: str
    videoDurationSeconds: Optional[int] = 30
    thumbnailUrl: str
    status: str = "completed"
    progress: int = 100
    statusMessage: str = "Destination identified"
    createdAt: str
    completedAt: Optional[str] = None
    errorMessage: Optional[str] = None
    candidates: List[DestinationCandidateModel] = []
    confirmedDestinationId: Optional[str] = None
    analysisDetails: AnalysisDetailsModel

class ConfirmDestinationRequest(BaseModel):
    candidateId: str

class VideoUrlRequest(BaseModel):
    url: str

class AskAssistantRequest(BaseModel):
    destination: str
    question: str

class GenerateItineraryRequest(BaseModel):
    destinationId: str
    destinationName: str
    durationDays: int = 3
    travelersCount: int = 2
    pace: str = "moderate"
    budgetCategory: str = "moderate"
    startDate: Optional[str] = None

class CalculateBudgetRequest(BaseModel):
    destinationId: str
    destinationName: str
    durationDays: int = 3
    travelersCount: int = 2
    tier: str = "moderate"
    currency: str = "USD"
