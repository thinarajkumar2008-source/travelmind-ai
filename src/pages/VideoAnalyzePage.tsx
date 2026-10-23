import React, { useState, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UploadCloud, 
  Link2, 
  FileVideo, 
  X, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Search,
  Scan,
  MapPin,
  Eye,
  Layers,
  ShieldCheck,
  Film
} from 'lucide-react'
import { api } from '../lib/api'
import { SUPPORTED_VIDEO_FORMATS, MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES, POPULAR_DESTINATIONS } from '../lib/constants'
import LocationSearchInput from '../components/geo/LocationSearchInput'
import { GeoLocation } from '../services/geoService'

export default function VideoAnalyzePage() {
  const location = useLocation()
  const initialUrl = (location.state as any)?.initialUrl || ''

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'manual'>(initialUrl ? 'url' : 'upload')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState(initialUrl)
  const [manualDestination, setManualDestination] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFileSelection = (selectedFile: File) => {
    setError('')
    if (!SUPPORTED_VIDEO_FORMATS.includes(selectedFile.type as any)) {
      setError('Unsupported video format. Please upload MP4, WebM, MOV, or MKV files.')
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`Video exceeds maximum size limit of ${MAX_FILE_SIZE_MB}MB.`)
      return
    }
    setFile(selectedFile)
    const preview = URL.createObjectURL(selectedFile)
    setPreviewUrl(preview)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleStartAnalysis = async () => {
    setError('')
    setAnalyzing(true)
    setProgress(5)
    setStatusMessage('Preparing video input for landmark scanning...')

    try {
      if (activeTab === 'upload') {
        if (!file) return
        const job = await api.analyzeVideoFile(file, (p, msg) => {
          setProgress(p)
          setStatusMessage(msg)
        })
        navigate(`/analysis/${job.id}`)
      } else if (activeTab === 'url') {
        if (!videoUrl || !videoUrl.startsWith('http')) {
          setError('Please provide a valid public video URL (YouTube, Vimeo, or direct link).')
          setAnalyzing(false)
          return
        }
        const job = await api.analyzeVideoUrl(videoUrl, (p, msg) => {
          setProgress(p)
          setStatusMessage(msg)
        })
        navigate(`/analysis/${job.id}`)
      } else if (activeTab === 'manual') {
        if (!manualDestination.trim()) {
          setError('Please enter a destination name.')
          setAnalyzing(false)
          return
        }
        const match = POPULAR_DESTINATIONS.find(
          d => d.name.toLowerCase().includes(manualDestination.toLowerCase()) ||
               d.location.toLowerCase().includes(manualDestination.toLowerCase())
        )
        if (match) {
          navigate(`/destination/${match.id}`)
        } else {
          navigate('/explore-map')
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Video analysis encountered an unexpected issue. Please retry.')
      setAnalyzing(false)
    }
  }

  const filteredSuggestions = POPULAR_DESTINATIONS.filter(d =>
    manualDestination.trim() &&
    (d.name.toLowerCase().includes(manualDestination.toLowerCase()) ||
     d.location.toLowerCase().includes(manualDestination.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F7FB] py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background cartographic texture */}
      <div className="absolute inset-0 carto-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#42E8D8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link to="/" className="text-xs font-mono text-[#42E8D8] hover:text-[#8AF7EF] flex items-center gap-1.5 transition-colors">
            <Compass className="w-4 h-4" />
            <span>&larr; BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-[#9BA9BD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#42E8D8] animate-ping" />
            <span>LABORATORY WORKSPACE · STEP 01</span>
          </div>
        </div>

        {/* Section Header with Required Copy */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1424] border border-[#42E8D8]/30 text-[#42E8D8] text-xs font-mono">
            <Scan className="w-3.5 h-3.5 text-[#42E8D8]" />
            <span>AI MULTIMODAL RECOGNITION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F5F7FB] font-display tracking-tight leading-tight">
            Show Us the Journey.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D8] via-[#8AF7EF] to-[#FFB86B]">
              We'll Help You Find the Place.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#9BA9BD] leading-relaxed">
            Upload a travel video, provide a supported video link, or search manually to begin your discovery.
          </p>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex justify-center">
          <div className="flex bg-[#0B1424] border border-white/10 rounded-2xl p-1.5 max-w-md w-full shadow-xl">
            {[
              { id: 'upload', label: 'Upload Video', icon: UploadCloud },
              { id: 'url', label: 'Video URL', icon: Link2 },
              { id: 'manual', label: 'Manual Search', icon: Search },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id as any); setError('') }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === id
                    ? 'bg-[#42E8D8] text-[#070B14] font-bold shadow-lg shadow-[#42E8D8]/20'
                    : 'text-[#9BA9BD] hover:text-[#F5F7FB]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace Glass Panel */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 relative">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Mode 1: File Upload */}
          {activeTab === 'upload' && (
            <div>
              {!file ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#42E8D8] bg-[#42E8D8]/10'
                      : 'border-white/15 hover:border-[#42E8D8]/50 hover:bg-white/[0.02]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                    onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-[#42E8D8]/10 border border-[#42E8D8]/20 text-[#42E8D8] flex items-center justify-center mx-auto mb-4">
                    <Film className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F7FB] mb-1 font-display">
                    {isDragging ? 'Drop video file here' : 'Drop video clip or browse from device'}
                  </h3>
                  <p className="text-xs text-[#9BA9BD] max-w-sm mx-auto">
                    MP4, WebM, MOV files up to {MAX_FILE_SIZE_MB}MB. Works with reels, landscape shorts, or long vlogs.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-black/70 border border-white/10 aspect-video max-h-80 mx-auto">
                    <video src={previewUrl!} controls className="w-full h-full object-contain" />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-red-500 text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#070B14]/80 border border-white/10">
                    <div className="flex items-center gap-3">
                      <FileVideo className="w-6 h-6 text-[#42E8D8]" />
                      <div>
                        <p className="text-sm font-semibold text-[#F5F7FB]">{file.name}</p>
                        <p className="text-xs text-[#9BA9BD] font-mono">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-xs font-semibold text-[#9BA9BD] hover:text-[#F5F7FB] cursor-pointer"
                    >
                      Replace File
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Video URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#9BA9BD] uppercase tracking-wider mb-2">
                  Public Video Link (Reel / Short / Clip)
                </label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9BA9BD]" />
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/shorts/... or direct MP4 link"
                    className="w-full pl-12 pr-4 py-4 bg-[#070B14] border border-white/10 rounded-2xl text-[#F5F7FB] placeholder-[#9BA9BD]/50 focus:outline-none focus:border-[#42E8D8] text-sm font-mono transition-all"
                  />
                </div>
              </div>
              <p className="text-xs text-[#9BA9BD] leading-relaxed">
                Direct public streams and accessible video links are supported. For DRM-protected social media reels, upload the video file directly for offline frame analysis.
              </p>
            </div>
          )}

          {/* Mode 3: Manual Search Fallback with 100+ Countries Database */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#9BA9BD] uppercase tracking-wider mb-2">
                  Search Global Destinations, Cities & Villages (100+ Countries)
                </label>
                <LocationSearchInput
                  placeholder="Search any destination worldwide (e.g. Kyoto, Munnar, Zermatt, Hallstatt)..."
                  onSelect={(loc: GeoLocation) => {
                    setManualDestination(loc.name)
                    // Check if known curated destination
                    const match = POPULAR_DESTINATIONS.find(
                      d => d.name.toLowerCase() === loc.name.toLowerCase() ||
                           loc.name.toLowerCase().includes(d.name.toLowerCase())
                    )
                    if (match) {
                      navigate(`/destination/${match.id}`)
                    } else {
                      navigate('/explore-map')
                    }
                  }}
                />
              </div>

              {filteredSuggestions.length > 0 && (
                <div className="p-2 rounded-xl bg-[#070B14] border border-white/10 space-y-1 max-h-40 overflow-y-auto">
                  {filteredSuggestions.map(dest => (
                    <button
                      key={dest.id}
                      onClick={() => navigate(`/destination/${dest.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.05] text-left text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#42E8D8]" />
                        <span className="font-semibold text-[#F5F7FB]">{dest.name}</span>
                        <span className="text-[#9BA9BD]">({dest.location})</span>
                      </div>
                      <span className="text-[#42E8D8] font-bold text-[11px] font-mono">View Guide &rarr;</span>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-[#9BA9BD]">
                Search settlements, towns, and tourist spots across 100+ countries with zero cost. Powered by GeoNames (CC BY 4.0) and OpenStreetMap.
              </p>
            </div>
          )}

          {/* Analysis Stages Progress Indicator */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 p-6 rounded-2xl bg-[#0B1424] border border-[#42E8D8]/30 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#42E8D8] flex items-center gap-2 font-bold">
                    <RefreshCw className="w-4 h-4 text-[#42E8D8] animate-spin" />
                    {statusMessage}
                  </span>
                  <span className="text-[#F5F7FB]">{progress}%</span>
                </div>

                <div className="w-full h-2 bg-[#070B14] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#42E8D8] to-[#25C2B4]" 
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                {/* 4 Honest Processing Stages */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                  {[
                    { label: '1. Preparing Video', active: progress >= 15 },
                    { label: '2. Examining Clues', active: progress >= 40 },
                    { label: '3. Matching Places', active: progress >= 75 },
                    { label: '4. Compiling Guide', active: progress >= 95 },
                  ].map(stage => (
                    <div
                      key={stage.label}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        stage.active
                          ? 'bg-[#42E8D8]/15 border-[#42E8D8]/40 text-[#42E8D8] font-bold'
                          : 'bg-[#070B14]/60 border-white/5 text-[#9BA9BD]'
                      }`}
                    >
                      {stage.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Trigger Button */}
          {!analyzing && (
            <button
              onClick={handleStartAnalysis}
              disabled={activeTab === 'upload' && !file}
              className={`mt-6 w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-300 cursor-pointer ${
                (activeTab === 'upload' && file) || activeTab !== 'upload'
                  ? 'bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] hover:from-[#8AF7EF] hover:to-[#42E8D8] text-[#070B14] shadow-xl shadow-[#42E8D8]/20 hover:scale-[1.01]'
                  : 'bg-[#101D32] text-[#9BA9BD] cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#070B14]" />
              <span>
                {activeTab === 'manual' ? 'Explore Destination Guide' : 'Analyze Video & Identify Landmarks'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#070B14]" />
            </button>
          )}
        </div>

        {/* Zero-Cost Compliance Note */}
        <div className="flex items-center justify-between text-xs text-[#9BA9BD] font-mono px-2">
          <div className="flex items-center gap-1.5 text-[#42E8D8]">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Cost Guarantee: Powered by Free-Tier AI & OpenStreetMap</span>
          </div>
          <span>Strictly ₹0 Commitment</span>
        </div>
      </div>
    </div>
  )
}
