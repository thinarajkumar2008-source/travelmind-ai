import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  HelpCircle, 
  FileVideo, 
  Hotel, 
  UtensilsCrossed, 
  Calendar, 
  Bookmark, 
  AlertTriangle,
  Layers,
  Volume2
} from 'lucide-react'
import { api } from '../lib/api'
import { VideoAnalysisJob, DestinationCandidate } from '../types'

export default function AnalysisResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [job, setJob] = useState<VideoAnalysisJob | null>(null)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      if (!id) return
      setLoading(true)
      const data = await api.getAnalysisJob(id)
      if (data) {
        setJob(data)
        const confirmed = data.confirmedDestinationId || data.candidates[0]?.id || ''
        setSelectedCandidateId(confirmed)
      }
      setLoading(false)
    }
    fetchJob()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Loading identification results...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-lg font-bold">Analysis record not found</p>
          <Link to="/analyze" className="px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-semibold inline-block">
            Upload a New Video
          </Link>
        </div>
      </div>
    )
  }

  const activeCandidate = job.candidates.find(c => c.id === selectedCandidateId) || job.candidates[0]

  const handleConfirmCandidate = async (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setConfirming(true)
    await api.confirmDestination(job.id, candidateId)
    setConfirming(false)
  }

  const handleSaveToBucket = async () => {
    if (!activeCandidate) return
    await api.saveTrip({
      id: 'saved-' + activeCandidate.id,
      destinationId: activeCandidate.id,
      destinationName: activeCandidate.name,
      stateOrRegion: activeCandidate.stateOrRegion,
      country: activeCandidate.country,
      coverImage: activeCandidate.imageUrl,
      savedAt: new Date().toISOString(),
      hasItinerary: false,
      notes: `Discovered from ${job.videoFileName}`
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link to="/dashboard" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToBucket}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-teal-400" />
              {savedSuccess ? 'Saved to Trips!' : 'Save Discovery'}
            </button>
            <Link
              to={`/destination/${activeCandidate.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-xs font-semibold text-white shadow-lg shadow-teal-500/20"
            >
              Open Full Guide
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Video Header Strip */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileVideo className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">{job.videoFileName}</p>
              <p className="text-xs text-navy-400">
                {job.videoFileSize} · Scanned {job.analysisDetails.framesAnalyzed} frames · {job.analysisDetails.sceneryTypes.join(', ')}
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 font-medium">
            AI Verification Completed
          </span>
        </div>

        {/* Main Candidate Recognition Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Top Match Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl overflow-hidden bg-white/[0.05] border border-white/10 backdrop-blur-xl shadow-2xl">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                <img 
                  src={activeCandidate.imageUrl} 
                  alt={activeCandidate.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                
                {/* Confidence Badge */}
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-teal-500/90 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {activeCandidate.confidence}% Confidence Match ({activeCandidate.confidenceLevel})
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                    Recognized Destination
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                    {activeCandidate.name}
                  </h2>
                  <p className="text-sm text-navy-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    {activeCandidate.stateOrRegion}, {activeCandidate.country}
                  </p>
                </div>
              </div>

              {/* Analysis Explanation Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">
                    Why the AI identified this place
                  </h3>
                  <p className="text-sm text-navy-200 leading-relaxed">
                    {activeCandidate.summary}
                  </p>
                </div>

                {/* Detected Landmarks */}
                <div>
                  <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    Recognized Landmarks & Topography
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCandidate.detectedLandmarks.map((lm) => (
                      <span key={lm} className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium">
                        📍 {lm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual & Audio Evidence */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                    <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-teal-400" />
                      Visual Clues
                    </p>
                    <ul className="text-xs text-navy-300 space-y-1.5 list-disc pl-4">
                      {activeCandidate.visualClues.map((clue, idx) => (
                        <li key={idx}>{clue}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                    <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                      Acoustic & Text Evidence
                    </p>
                    <p className="text-xs text-navy-300 leading-relaxed">
                      {activeCandidate.audioEvidence || 'No audible speech identified. Recognition relies on optical landmark cues.'}
                    </p>
                    {activeCandidate.textOrSignsDetected.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] text-teal-400 font-medium">
                          Text OCR: {activeCandidate.textOrSignsDetected.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Confirmation Buttons */}
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Does this match what was in your video?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConfirmCandidate(activeCandidate.id)}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-md"
                    >
                      {activeCandidate.isConfirmed ? '✓ Confirmed Match' : 'Confirm Destination'}
                    </button>
                    <Link
                      to="/analyze"
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-navy-400 hover:text-white text-xs font-medium"
                    >
                      Not Correct?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Alternative Matches & Quick Tools */}
          <div className="space-y-6">
            {/* Alternative Candidates */}
            <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-400" />
                Alternative Matches Considered
              </h3>
              <p className="text-xs text-navy-400">
                When landscape contours resemble multiple regions, candidates are listed below for verification:
              </p>

              <div className="space-y-3 pt-2">
                {job.candidates.map((cand) => {
                  const isSelected = cand.id === activeCandidate.id
                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidateId(cand.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected 
                          ? 'bg-teal-500/15 border-teal-500/50 text-white' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-navy-300'
                      }`}
                    >
                      <img src={cand.imageUrl} alt={cand.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-xs text-white truncate">{cand.name}</p>
                          <span className="text-[11px] font-bold text-teal-400">{cand.confidence}%</span>
                        </div>
                        <p className="text-[11px] text-navy-400 truncate">{cand.stateOrRegion}, {cand.country}</p>
                        <span className="text-[10px] text-teal-300/80 mt-0.5 inline-block">
                          {isSelected ? '● Currently Viewing' : 'Click to inspect'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-6 space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Explore {activeCandidate.name}</h3>
              
              <Link
                to={`/destination/${activeCandidate.id}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-xs font-semibold text-teal-300 hover:text-white transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-teal-400" />
                  Explore Destination Guide
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </Link>

              <Link
                to="/explore-map"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 text-xs font-semibold text-navy-200 hover:text-white transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  View on OpenStreetMap
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-navy-400" />
              </Link>

              <Link
                to={`/hotels?destination=${activeCandidate.id}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 text-xs font-semibold text-navy-200 hover:text-white transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Hotel className="w-4 h-4 text-teal-400" />
                  Nearby Hotels & Resorts
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-navy-400" />
              </Link>

              <Link
                to={`/restaurants?destination=${activeCandidate.id}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 text-xs font-semibold text-navy-200 hover:text-white transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <UtensilsCrossed className="w-4 h-4 text-teal-400" />
                  Local Restaurants & Dining
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-navy-400" />
              </Link>

              <Link
                to={`/itinerary?destination=${activeCandidate.id}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 text-xs font-semibold text-navy-200 hover:text-white transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  Smart AI Itinerary Planner
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-navy-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
