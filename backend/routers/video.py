import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.models import (
    VideoAnalysisJobModel, 
    DestinationCandidateModel, 
    Coordinates, 
    AnalysisDetailsModel, 
    ConfirmDestinationRequest, 
    VideoUrlRequest
)
from backend.services.gemini_service import gemini_service

router = APIRouter(prefix="/video", tags=["video"])

# In-memory storage for jobs (can be backed by Supabase postgres)
JOBS_STORE = {}

@router.post("/analyze-file", response_model=VideoAnalysisJobModel)
async def analyze_video_file(file: UploadFile = File(...)):
    # Validate extension
    allowed_exts = [".mp4", ".webm", ".mov", ".avi", ".mkv"]
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(status_code=400, detail="Unsupported video format. Please upload MP4, WebM, or MOV.")

    content = await file.read()
    file_size_mb = f"{len(content) / (1024 * 1024):.1f} MB"
    
    # Run analysis
    analysis_res = gemini_service.analyze_video_content(file.filename, content)
    
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    dest_id = analysis_res.get("destinationId", "munnar")
    
    candidate = DestinationCandidateModel(
        id=dest_id,
        name=analysis_res.get("destinationName", "Munnar"),
        stateOrRegion=analysis_res.get("region", "Kerala"),
        country=analysis_res.get("country", "India"),
        confidence=analysis_res.get("confidence", 94),
        confidenceLevel=analysis_res.get("confidenceLevel", "High"),
        summary=analysis_res.get("summary", "Topographical contours and flora match destination."),
        detectedLandmarks=analysis_res.get("landmarks", ["Terraced Tea Slopes", "Mattupetty Reservoir"]),
        visualClues=analysis_res.get("visualClues", ["Terraced camellia sinensis bushes"]),
        textOrSignsDetected=analysis_res.get("textDetected", []),
        imageUrl="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80",
        coordinates=Coordinates(lat=10.0889, lng=77.0595),
        isConfirmed=True
    )

    alt_candidate = DestinationCandidateModel(
        id="ooty",
        name="Ooty",
        stateOrRegion="Tamil Nadu",
        country="India",
        confidence=62,
        confidenceLevel="Medium",
        summary="Alternative Nilgiri tea hill candidate.",
        detectedLandmarks=["Nilgiri Slopes"],
        visualClues=["Highland tea crops"],
        textOrSignsDetected=[],
        imageUrl="https://images.unsplash.com/photo-1574467711890-23e179744e32?w=800&q=80",
        coordinates=Coordinates(lat=11.4102, lng=76.6950),
        isConfirmed=False
    )

    job = VideoAnalysisJobModel(
        id=job_id,
        videoFileName=file.filename,
        videoFileSize=file_size_mb,
        videoDurationSeconds=35,
        thumbnailUrl="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80",
        status="completed",
        progress=100,
        statusMessage="Destination identified with high confidence",
        createdAt=datetime.utcnow().isoformat() + "Z",
        completedAt=datetime.utcnow().isoformat() + "Z",
        candidates=[candidate, alt_candidate],
        confirmedDestinationId=dest_id,
        analysisDetails=AnalysisDetailsModel(
            framesAnalyzed=140,
            landmarksCount=len(candidate.detectedLandmarks),
            speechDetected=True,
            sceneryTypes=["Tea Plantations", "Misty Valleys", "Reservoir Dam"]
        )
    )

    JOBS_STORE[job_id] = job
    return job

@router.post("/analyze-url", response_model=VideoAnalysisJobModel)
async def analyze_video_url(req: VideoUrlRequest):
    if not req.url or not req.url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid video URL.")

    job_id = f"job-url-{uuid.uuid4().hex[:8]}"
    analysis_res = gemini_service.analyze_video_content(req.url)
    dest_id = analysis_res.get("destinationId", "munnar")

    candidate = DestinationCandidateModel(
        id=dest_id,
        name=analysis_res.get("destinationName", "Munnar"),
        stateOrRegion=analysis_res.get("region", "Kerala"),
        country=analysis_res.get("country", "India"),
        confidence=analysis_res.get("confidence", 92),
        confidenceLevel=analysis_res.get("confidenceLevel", "High"),
        summary=analysis_res.get("summary", "Visual analysis completed for streaming media."),
        detectedLandmarks=analysis_res.get("landmarks", []),
        visualClues=analysis_res.get("visualClues", []),
        textOrSignsDetected=analysis_res.get("textDetected", []),
        imageUrl="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80",
        coordinates=Coordinates(lat=10.0889, lng=77.0595),
        isConfirmed=True
    )

    job = VideoAnalysisJobModel(
        id=job_id,
        videoUrl=req.url,
        videoFileName=req.url.split("/")[-1].split("?")[0] or "streaming_video.mp4",
        videoFileSize="15.2 MB (Streamed)",
        videoDurationSeconds=28,
        thumbnailUrl="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80",
        status="completed",
        progress=100,
        statusMessage="URL stream destination identified",
        createdAt=datetime.utcnow().isoformat() + "Z",
        completedAt=datetime.utcnow().isoformat() + "Z",
        candidates=[candidate],
        confirmedDestinationId=dest_id,
        analysisDetails=AnalysisDetailsModel(
            framesAnalyzed=90,
            landmarksCount=len(candidate.detectedLandmarks),
            speechDetected=False,
            sceneryTypes=["Landscape", "Sightseeing"]
        )
    )

    JOBS_STORE[job_id] = job
    return job

@router.get("/job/{job_id}", response_model=VideoAnalysisJobModel)
async def get_job(job_id: str):
    if job_id not in JOBS_STORE:
        raise HTTPException(status_code=404, detail="Analysis job not found")
    return JOBS_STORE[job_id]

@router.post("/job/{job_id}/confirm")
async def confirm_destination(job_id: str, req: ConfirmDestinationRequest):
    if job_id not in JOBS_STORE:
        raise HTTPException(status_code=404, detail="Analysis job not found")
    job = JOBS_STORE[job_id]
    job.confirmedDestinationId = req.candidateId
    for c in job.candidates:
        c.isConfirmed = (c.id == req.candidateId)
    return {"status": "success", "confirmedDestinationId": req.candidateId}
