import pytest
import os
from backend.models import (
    VideoAnalysisJobModel, 
    DestinationCandidateModel, 
    Coordinates, 
    AnalysisDetailsModel,
    GenerateItineraryRequest,
    CalculateBudgetRequest
)

def test_video_analysis_job_model():
    candidate = DestinationCandidateModel(
        id="munnar",
        name="Munnar",
        stateOrRegion="Kerala",
        country="India",
        confidence=94,
        confidenceLevel="High",
        summary="Tea garden terraces and reservoir dam match.",
        detectedLandmarks=["Mattupetty Dam", "KDHP Tea Museum"],
        visualClues=["Tea plantations", "Hill mist"],
        textOrSignsDetected=["'Munnar'"],
        imageUrl="https://images.unsplash.com/photo-1625505826533-5c80aca7d157",
        coordinates=Coordinates(lat=10.0889, lng=77.0595),
        isConfirmed=True
    )

    job = VideoAnalysisJobModel(
        id="test-job-uuid-1",
        videoFileName="kerala_vlog.mp4",
        videoFileSize="24.5 MB",
        thumbnailUrl="https://images.unsplash.com/photo-1625505826533-5c80aca7d157",
        status="completed",
        progress=100,
        createdAt="2025-01-01T00:00:00Z",
        candidates=[candidate],
        confirmedDestinationId="munnar",
        analysisDetails=AnalysisDetailsModel(
            framesAnalyzed=120,
            landmarksCount=2,
            speechDetected=True,
            sceneryTypes=["Tea Plantations", "Misty Hills"]
        )
    )

    assert job.id == "test-job-uuid-1"
    assert job.candidates[0].name == "Munnar"
    assert job.candidates[0].confidence == 94
    assert job.status == "completed"

def test_sql_schema_syntax_integrity():
    schema_path = os.path.join(os.path.dirname(__file__), "..", "..", "supabase", "migrations", "20250101000000_full_schema.sql")
    assert os.path.exists(schema_path), "Migration schema file must exist"
    
    with open(schema_path, "r", encoding="utf-8") as f:
        sql = f.read()
    
    # Check that all 8 required tables and storage bucket exist
    required_tables = [
        "profiles",
        "destinations",
        "video_analyses",
        "saved_destinations",
        "saved_places",
        "itineraries",
        "travel_budgets",
        "user_preferences",
    ]
    for table in required_tables:
        assert f"CREATE TABLE IF NOT EXISTS public.{table}" in sql, f"Table {table} must be in schema"

    # Verify RLS enabled on all tables
    for table in required_tables:
        assert f"ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;" in sql

    # Verify user isolation with auth.uid()
    assert "auth.uid()" in sql
    assert "storage.buckets" in sql
    assert "'travel-videos'" in sql
