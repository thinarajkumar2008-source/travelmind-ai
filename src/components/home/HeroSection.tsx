import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  Link2,
  Sparkles,
  ArrowRight,
  CloudUpload,
  Search,
  MapPin,
  Compass,
  FileVideo,
  X,
  Play,
  Globe2,
  ChevronDown
} from 'lucide-react'
import {
  SUPPORTED_VIDEO_FORMATS,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  POPULAR_DESTINATIONS
} from '../../lib/constants'

interface VideoFile {
  file: File
  name: string
  size: string
  preview: string
}

export default function HeroSection() {
  const navigate = useNavigate()
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [manualSearch, setManualSearch] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'search'>('upload')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_VIDEO_FORMATS.includes(file.type as any)) {
      return 'Please upload MP4, WebM, MOV, or MKV files.'
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File exceeds max size limit of ${MAX_FILE_SIZE_MB}MB.`
    }
    return null
  }

  const handleFile = useCallback((file: File) => {
    setError('')
    const valError = validateFile(file)
    if (valError) {
      setError(valError)
      return
    }
    const preview = URL.createObjectURL(file)
    setVideoFile({
      file,
      name: file.name,
      size: formatFileSize(file.size),
      preview,
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleRemoveVideo = () => {
    if (videoFile?.preview) URL.revokeObjectURL(videoFile.preview)
    setVideoFile(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAnalyze = () => {
    if (activeTab === 'url') {
      if (!videoUrl || !videoUrl.startsWith('http')) {
        setError('Please enter a valid video URL (e.g. YouTube Shorts or public reel).')
        return
      }
      navigate('/analyze', { state: { initialUrl: videoUrl } })
      return
    }

    if (activeTab === 'search') {
      if (!manualSearch.trim()) {
        setError('Please type a destination name.')
        return
      }
      const match = POPULAR_DESTINATIONS.find(
        d => d.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
             d.location.toLowerCase().includes(manualSearch.toLowerCase())
      )
      if (match) {
        navigate(`/destination/${match.id}`)
      } else {
        navigate('/explore-map')
      }
      return
    }

    navigate('/analyze')
  }

  const filteredSuggestions = POPULAR_DESTINATIONS.filter(d =>
    manualSearch.trim() &&
    (d.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
     d.location.toLowerCase().includes(manualSearch.toLowerCase()))
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070B14] pt-24 pb-16">
      {/* Cinematic Fullscreen Background with Ambient Depth */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=85)',
          }}
        />
        {/* Layered Gradient Mask to preserve readability and deep ocean tone */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/85 to-[#070B14]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-[#070B14]/60" />
        <div className="absolute inset-0 carto-grid opacity-30" />
      </div>

      {/* Floating Animated Cartographic Route Coordinates */}
      <div className="absolute top-28 right-8 lg:right-16 z-10 hidden md:flex items-center gap-4 text-[11px] font-mono text-[#9BA9BD] bg-[#0B1424]/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <span className="flex items-center gap-1.5 text-[#42E8D8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#42E8D8] animate-ping" />
          10°05'19"N · 77°03'34"E
        </span>
        <span className="text-white/20">|</span>
        <span>ELEVATION 1,600M</span>
        <span className="text-white/20">|</span>
        <span className="text-[#FFB86B]">MUNNAR HIGHLANDS</span>
      </div>

      {/* Main Container: Editorial Asymmetrical Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column (7 cols): Editorial Typography & Vision */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Minimal Sub-Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B1424]/80 border border-[#42E8D8]/30 shadow-lg shadow-[#42E8D8]/5 backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-[#42E8D8]" />
              <span className="text-xs font-semibold text-[#8AF7EF] tracking-wider uppercase font-mono">
                Multimodal Travel Intelligence
              </span>
            </div>

            {/* Required Headline with Brand Accents */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold text-[#F5F7FB] leading-[1.08] tracking-tight font-display">
              Every Journey Has a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D8] via-[#8AF7EF] to-[#42E8D8]">
                Story
              </span>
              .<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D8] to-[#8AF7EF]">
                Discover
              </span>{' '}
              Where It Leads.
            </h1>

            {/* Required Supporting Text */}
            <p className="text-base sm:text-lg text-[#9BA9BD] leading-relaxed max-w-xl font-normal">
              Turn travel videos into extraordinary discoveries. Find the places behind your favorite journeys and explore what awaits beyond the frame.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const destElem = document.getElementById('destinations')
                  if (destElem) destElem.scrollIntoView({ behavior: 'smooth' })
                  else navigate('/explore-map')
                }}
                className="group flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-[#F5F7FB] font-bold text-sm border border-white/15 hover:border-[#42E8D8]/50 shadow-xl backdrop-blur-xl transition-all duration-300 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#42E8D8] group-hover:rotate-45 transition-transform duration-300" />
                <span>Discover a Destination</span>
              </button>

              <button
                onClick={() => navigate('/analyze')}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] hover:from-[#8AF7EF] hover:to-[#42E8D8] text-[#070B14] font-extrabold text-sm shadow-xl shadow-[#42E8D8]/20 hover:shadow-[#42E8D8]/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#070B14]" />
                <span>Analyze a Travel Video</span>
                <ArrowRight className="w-4 h-4 text-[#070B14] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Cartographic Micro-Metadata Bar */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#9BA9BD] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42E8D8]" />
                <span>Zero-Cost Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB86B]" />
                <span>Leaflet & OpenStreetMap</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AF7EF]" />
                <span>Visual Landmark Matching</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column (5 cols): Intelligent Discovery Workspace Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl glass-panel-glow p-6 sm:p-7 overflow-hidden">
              {/* Subtle Ambient Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#42E8D8]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Workspace Segmented Tabs */}
              <div className="flex bg-[#070B14]/80 p-1.5 rounded-2xl border border-white/10 mb-5">
                {[
                  { id: 'upload', label: 'Upload File', icon: Upload },
                  { id: 'url', label: 'Paste URL', icon: Link2 },
                  { id: 'search', label: 'Search Place', icon: Search },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setActiveTab(id as any); setError('') }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeTab === id
                        ? 'bg-[#42E8D8] text-[#070B14] shadow-md font-bold'
                        : 'text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Tab 1: Video File Upload */}
              {activeTab === 'upload' && (
                <div>
                  {!videoFile ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#42E8D8] bg-[#42E8D8]/10'
                          : 'border-white/15 hover:border-[#42E8D8]/50 hover:bg-white/[0.02]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={SUPPORTED_VIDEO_FORMATS.join(',')}
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                      />
                      <div className="w-14 h-14 rounded-2xl bg-[#42E8D8]/10 border border-[#42E8D8]/20 text-[#42E8D8] flex items-center justify-center mx-auto mb-3">
                        <CloudUpload className="w-7 h-7" />
                      </div>
                      <p className="text-[#F5F7FB] font-bold text-sm mb-1">
                        {isDragging ? 'Drop travel video here' : 'Drop video or click to upload'}
                      </p>
                      <p className="text-[#9BA9BD] text-xs">
                        MP4, WebM, MOV · Max {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl overflow-hidden bg-[#070B14]/90 border border-white/10">
                      <div className="relative aspect-video max-h-56">
                        <video src={videoFile.preview} className="w-full h-full object-cover" controls />
                        <button
                          onClick={handleRemoveVideo}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-500 text-white transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileVideo className="w-4 h-4 text-[#42E8D8] shrink-0" />
                          <span className="text-[#F5F7FB] font-medium truncate">{videoFile.name}</span>
                        </div>
                        <span className="text-[#9BA9BD] shrink-0">{videoFile.size}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Public Video URL */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9BA9BD]" />
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => { setVideoUrl(e.target.value); setError('') }}
                      placeholder="Paste YouTube Shorts or public video link..."
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#070B14] border border-white/10 text-[#F5F7FB] placeholder-[#9BA9BD]/50 text-xs sm:text-sm focus:outline-none focus:border-[#42E8D8] transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#9BA9BD] leading-relaxed">
                    Supports public video URLs. For DRM or private social reels, upload the video file directly.
                  </p>
                </div>
              )}

              {/* Tab 3: Manual Destination Search */}
              {activeTab === 'search' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#42E8D8]" />
                    <input
                      type="text"
                      value={manualSearch}
                      onChange={(e) => { setManualSearch(e.target.value); setError('') }}
                      placeholder="e.g. Munnar, Bali, Kyoto, Jaipur, Alps..."
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#070B14] border border-white/10 text-[#F5F7FB] placeholder-[#9BA9BD]/50 text-xs sm:text-sm focus:outline-none focus:border-[#42E8D8] transition-all"
                    />
                  </div>

                  {filteredSuggestions.length > 0 && (
                    <div className="p-1.5 rounded-xl bg-[#070B14] border border-white/10 space-y-1 max-h-36 overflow-y-auto">
                      {filteredSuggestions.map(dest => (
                        <button
                          key={dest.id}
                          onClick={() => {
                            setManualSearch(dest.name)
                            navigate(`/destination/${dest.id}`)
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-left text-xs transition-colors cursor-pointer"
                        >
                          <span className="text-[#F5F7FB] font-medium flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-[#42E8D8]" />
                            {dest.name} ({dest.location})
                          </span>
                          <span className="text-[#42E8D8] font-bold text-[10px]">Open Guide &rarr;</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-[#9BA9BD]">
                    Search any destination directly to access verified itineraries and maps at ₹0 cost.
                  </p>
                </div>
              )}

              {/* Error Notification */}
              {error && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                  {error}
                </div>
              )}

              {/* Primary Action Button */}
              <button
                onClick={handleAnalyze}
                className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] hover:from-[#8AF7EF] hover:to-[#42E8D8] text-[#070B14] font-black text-sm tracking-wide shadow-lg shadow-[#42E8D8]/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#070B14]" />
                <span>
                  {activeTab === 'search' ? 'Search Destination Guide' : 'Analyze & Identify Destination'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#070B14]" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[10px] text-[#9BA9BD] font-mono tracking-widest uppercase pointer-events-none">
        <span>Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 text-[#42E8D8] animate-bounce" />
      </div>
    </section>
  )
}
