import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Compass, 
  Sparkles, 
  Hotel, 
  UtensilsCrossed, 
  Bookmark, 
  ShieldAlert, 
  Layers, 
  Thermometer, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Plane, 
  Train, 
  Car, 
  DollarSign,
  ExternalLink,
  Star,
  Map as MapIcon
} from 'lucide-react'
import { api } from '../lib/api'
import { TravelGuide } from '../types'
import { destinationService } from '../services/destinationService'
import { useAuth } from '../context/AuthContext'
import TravelMap, { MapPlace } from '../components/map/TravelMap'
import { MOCK_HOTELS, MOCK_RESTAURANTS, MOCK_ATTRACTIONS } from '../lib/mockData'

export default function CompleteTravelGuidePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [guide, setGuide] = useState<TravelGuide | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'places' | 'stay' | 'taste' | 'practical'>('overview')
  const [isSaved, setIsSaved] = useState(false)
  const [question, setQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [asking, setAsking] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const destinationPlaces: MapPlace[] = useMemo(() => {
    if (!guide) return []
    const list: MapPlace[] = [
      {
        id: `dest-${guide.id}`,
        name: guide.name,
        category: 'destination',
        subCategory: 'Destination Center',
        latitude: guide.coordinates.lat,
        longitude: guide.coordinates.lng,
        address: `${guide.stateOrRegion}, ${guide.country}`,
        image: guide.coverImage,
        description: guide.tagline,
      }
    ]
    const attractions = MOCK_ATTRACTIONS[guide.id] || []
    attractions.forEach(a => {
      list.push({
        id: a.id,
        name: a.name,
        category: 'attraction',
        subCategory: a.category,
        latitude: a.coordinates.lat,
        longitude: a.coordinates.lng,
        address: `${guide.name} Region`,
        rating: a.rating,
        image: a.imageUrl,
        description: a.description,
      })
    })
    const hotels = MOCK_HOTELS[guide.id] || []
    hotels.forEach(h => {
      list.push({
        id: h.id,
        name: h.name,
        category: 'hotel',
        subCategory: h.category,
        latitude: h.coordinates.lat,
        longitude: h.coordinates.lng,
        address: h.address,
        rating: h.rating,
        image: h.imageUrl,
        description: h.amenities ? `Amenities: ${h.amenities.slice(0, 3).join(', ')}` : '',
      })
    })
    const restaurants = MOCK_RESTAURANTS[guide.id] || []
    restaurants.forEach(r => {
      list.push({
        id: r.id,
        name: r.name,
        category: 'restaurant',
        subCategory: r.cuisine ? r.cuisine.join(', ') : 'Dining',
        latitude: r.coordinates.lat,
        longitude: r.coordinates.lng,
        address: r.address,
        rating: r.rating,
        image: r.imageUrl,
        description: r.specialties ? `Specialties: ${r.specialties.slice(0, 2).join(', ')}` : '',
      })
    })
    return list
  }, [guide])

  useEffect(() => {
    async function fetchGuide() {
      if (!id) return
      setLoading(true)
      const data = await api.getTravelGuide(id)
      setGuide(data)
      setChatHistory([
        { 
          role: 'assistant', 
          text: `Welcome to ${data.name}! Ask me about mountain trekking trails, tea plantations, seasonal weather, or insider packing tips.` 
        }
      ])
      if (user?.id) {
        const saved = await destinationService.isDestinationSaved(user.id, data.id)
        setIsSaved(saved)
      }
      setLoading(false)
    }
    fetchGuide()
  }, [id, user?.id])

  const handleAskAssistant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !guide || asking) return
    const userQ = question.trim()
    setQuestion('')
    setChatHistory(prev => [...prev, { role: 'user', text: userQ }])
    setAsking(true)
    const answer = await api.askTravelAssistant(guide.name, userQ)
    setChatHistory(prev => [...prev, { role: 'assistant', text: answer }])
    setAsking(false)
  }

  const handleSaveDestination = async () => {
    if (!guide || !user?.id) return
    if (isSaved) {
      await destinationService.unsaveDestination(user.id, guide.id)
      setIsSaved(false)
    } else {
      await destinationService.saveDestination(user.id, {
        destinationId: guide.id,
        destinationName: guide.name,
        stateOrRegion: guide.stateOrRegion,
        country: guide.country,
        coverImage: guide.coverImage,
      })
      setIsSaved(true)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] text-[#F5F7FB] flex items-center justify-center">
        <div className="text-center space-y-3 font-mono">
          <Compass className="w-8 h-8 text-[#42E8D8] animate-spin mx-auto" />
          <p className="text-xs text-[#9BA9BD] tracking-wider uppercase">Loading Editorial Guide...</p>
        </div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#070B14] text-[#F5F7FB] flex items-center justify-center p-6 font-mono text-center">
        <div>
          <p className="text-lg font-bold">Destination guide not found.</p>
          <Link to="/" className="mt-4 inline-block text-xs text-[#42E8D8] underline">&larr; Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F7FB]">
      
      {/* Editorial Photographic Hero Banner */}
      <div className="relative h-[65vh] sm:h-[72vh] w-full overflow-hidden">
        <img
          src={guide.coverImage}
          alt={guide.name}
          className="w-full h-full object-cover transform scale-105"
        />
        {/* Layered Gradient for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/50 to-transparent" />
        <div className="absolute inset-0 carto-grid opacity-20 pointer-events-none" />

        {/* Floating Top Navigation */}
        <div className="absolute top-6 left-6 right-6 max-w-7xl mx-auto flex items-center justify-between z-20">
          <Link
            to="/explore-map"
            className="px-4 py-2 rounded-xl bg-[#070B14]/80 backdrop-blur-md border border-white/10 text-xs font-mono text-[#F5F7FB] flex items-center gap-2 hover:bg-[#070B14] transition-all"
          >
            <Compass className="w-4 h-4 text-[#42E8D8]" />
            <span>Digital Atlas</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDestination}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#42E8D8] text-[#070B14]'
                  : 'bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[#F5F7FB]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#070B14]' : ''}`} />
              <span>{isSaved ? 'Saved in Collection' : savedSuccess ? 'Saved!' : 'Save Destination'}</span>
            </button>

            <Link
              to={`/itinerary?destination=${guide.id}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] hover:from-[#8AF7EF] hover:to-[#42E8D8] text-[#070B14] text-xs font-extrabold tracking-wide shadow-lg shadow-[#42E8D8]/20 transition-all cursor-pointer"
            >
              Create Itinerary
            </Link>
          </div>
        </div>

        {/* Hero Title & Geographic Coordinates */}
        <div className="absolute bottom-8 left-6 right-6 max-w-7xl mx-auto z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#9BA9BD]">
            <span className="px-3 py-1 rounded-full bg-[#070B14]/80 backdrop-blur-md border border-[#42E8D8]/30 text-[#42E8D8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#42E8D8]" />
              VERIFIED EDITORIAL GUIDE
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#42E8D8]" />
              {guide.stateOrRegion}, {guide.country}
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>{guide.coordinates.lat.toFixed(4)}°N, {guide.coordinates.lng.toFixed(4)}°E</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black text-[#F5F7FB] font-display tracking-tight leading-none">
            {guide.name}
          </h1>
          <p className="text-base sm:text-xl text-[#8AF7EF] font-medium max-w-2xl font-editorial italic pt-1">
            "{guide.tagline}"
          </p>
        </div>
      </div>

      {/* Editorial Navigation Sub-Tabs */}
      <div className="sticky top-0 z-30 bg-[#070B14]/90 backdrop-blur-2xl border-y border-white/10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-3 gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'overview', label: 'The Destination' },
              { id: 'map', label: 'Interactive Map (OSM)' },
              { id: 'places', label: 'Places Worth Discovering' },
              { id: 'stay', label: 'Stay Nearby' },
              { id: 'taste', label: 'Taste the Destination' },
              { id: 'practical', label: 'Traveler Essentials' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#42E8D8] text-[#070B14] font-bold shadow-md' 
                    : 'text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/[0.05]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 border-l border-white/10 pl-3">
            <Link
              to={`/itinerary?destination=${guide.id}`}
              className="px-3.5 py-1.5 rounded-lg bg-[#42E8D8]/10 border border-[#42E8D8]/20 text-xs font-semibold text-[#42E8D8] hover:bg-[#42E8D8] hover:text-[#070B14] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" /> Plan Itinerary
            </Link>
          </div>
        </div>
      </div>

      {/* Main Editorial Content Body */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column (8 cols): Magazine Narrative */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Tab 1: The Destination (Overview & History) */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <section className="glass-panel rounded-3xl p-7 sm:p-9 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#42E8D8]">SECTION 01 · GEOGRAPHY & SPIRIT</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] font-display">
                    About {guide.name}
                  </h2>
                  <p className="text-base text-[#F5F7FB]/90 leading-relaxed font-sans">
                    {guide.overview.description}
                  </p>
                  <p className="text-sm text-[#9BA9BD] leading-relaxed pt-2">
                    {guide.overview.geography}
                  </p>
                </section>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="glass-panel rounded-3xl p-7 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FFB86B]">HERITAGE</span>
                    <h3 className="text-lg font-bold text-[#F5F7FB] font-display">History & Settlement</h3>
                    <p className="text-xs sm:text-sm text-[#9BA9BD] leading-relaxed">
                      {guide.overview.history}
                    </p>
                  </div>

                  <div className="glass-panel rounded-3xl p-7 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#8AF7EF]">INDIGENOUS CULTURE</span>
                    <h3 className="text-lg font-bold text-[#F5F7FB] font-display">Cultural Significance</h3>
                    <p className="text-xs sm:text-sm text-[#9BA9BD] leading-relaxed">
                      {guide.overview.culturalSignificance}
                    </p>
                  </div>
                </div>

                {/* Key Landmarks Tag Cloud */}
                <div className="glass-panel rounded-3xl p-7 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#9BA9BD]">Recognized Landmark Cues</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {guide.overview.famousLandmarks.map((lm) => (
                      <span key={lm} className="px-3.5 py-1.5 rounded-xl bg-[#0B1424] border border-[#42E8D8]/25 text-[#42E8D8] text-xs font-mono">
                        📍 {lm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Interactive OpenStreetMap */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#F5F7FB] font-display flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#42E8D8]" />
                      Interactive OpenStreetMap: {guide.name}
                    </h2>
                    <p className="text-xs text-[#9BA9BD] mt-0.5 font-mono">
                      100% Free Leaflet & OpenStreetMap tiles. No Google Maps billing or API key.
                    </p>
                  </div>
                  <Link
                    to="/explore-map"
                    className="px-4 py-2 rounded-xl bg-[#42E8D8] text-[#070B14] font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Open Fullscreen Atlas &rarr;
                  </Link>
                </div>

                <TravelMap
                  places={destinationPlaces}
                  center={[guide.coordinates.lat, guide.coordinates.lng]}
                  zoom={12}
                  height="580px"
                  showFilterBar={true}
                  showLegend={true}
                  showDetailsPane={true}
                />
              </div>
            )}

            {/* Tab 3: Places Worth Discovering */}
            {activeTab === 'places' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-[#F5F7FB] font-display">Places Worth Discovering</h2>
                  <span className="text-xs font-mono text-[#9BA9BD]">{guide.thingsToDo.length} Curated Spots</span>
                </div>

                <div className="grid gap-6">
                  {guide.thingsToDo.map((item, idx) => (
                    <div
                      key={item.id}
                      className="glass-panel rounded-3xl p-7 border border-white/10 hover:border-[#42E8D8]/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#42E8D8]/10 text-[#42E8D8] border border-[#42E8D8]/20">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono text-[#9BA9BD]">⏱️ {item.duration}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#F5F7FB] font-display">{item.title}</h3>
                      <p className="text-sm text-[#9BA9BD] leading-relaxed">{item.description}</p>
                      <div className="pt-2 flex items-center justify-between text-xs text-[#9BA9BD]">
                        <span>Recommended for: <strong className="text-[#F5F7FB]">{item.suitableFor}</strong></span>
                        <Link
                          to={`/itinerary?destination=${guide.id}`}
                          className="text-[#42E8D8] font-bold hover:underline"
                        >
                          Add to Itinerary &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Stay Nearby (Hotels) */}
            {activeTab === 'stay' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#F5F7FB] font-display">Curated Accommodations</h2>
                    <p className="text-xs text-[#9BA9BD] mt-0.5">Verified coordinates, amenities, and external booking searches without paid APIs.</p>
                  </div>
                  <Link to={`/hotels?destination=${guide.id}`} className="text-xs font-mono text-[#42E8D8] hover:underline">
                    View All Hotels &rarr;
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {(MOCK_HOTELS[guide.id] || []).map((hotel) => (
                    <div key={hotel.id} className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between">
                      <div className="relative h-44 overflow-hidden">
                        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#070B14]/80 text-[#42E8D8] text-[10px] font-mono">
                          {hotel.category}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#070B14]/80 text-[#FFB86B] text-xs font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#FFB86B]" /> {hotel.rating}
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <h4 className="font-bold text-base text-[#F5F7FB] font-display">{hotel.name}</h4>
                        <p className="text-xs text-[#9BA9BD]">{hotel.distanceKm} km from center · {hotel.address}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="text-sm font-bold text-[#42E8D8] font-mono">${hotel.pricePerNight} <span className="text-xs text-[#9BA9BD]">USD/night</span></span>
                          <a
                            href={hotel.bookingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-[#42E8D8] text-[#070B14] font-bold text-xs flex items-center gap-1"
                          >
                            Book <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Taste the Destination (Dining) */}
            {activeTab === 'taste' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#F5F7FB] font-display">Gastronomy & Local Flavors</h2>
                    <p className="text-xs text-[#9BA9BD] mt-0.5">Signature dishes and regional dining customs.</p>
                  </div>
                  <Link to={`/restaurants?destination=${guide.id}`} className="text-xs font-mono text-[#42E8D8] hover:underline">
                    View All Dining &rarr;
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {guide.foodAndCulture.specialties.map((dish) => (
                    <div key={dish.name} className="glass-panel p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#F5F7FB] font-display">{dish.name}</h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${dish.isVeg ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                        </span>
                      </div>
                      <p className="text-xs text-[#9BA9BD] leading-relaxed">{dish.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Traveler Essentials (Practical Info) */}
            {activeTab === 'practical' && (
              <div className="glass-panel rounded-3xl p-7 sm:p-9 space-y-6">
                <h2 className="text-2xl font-extrabold text-[#F5F7FB] font-display">Traveler Essentials</h2>
                
                <div className="space-y-4 text-xs text-[#9BA9BD]">
                  <div className="p-4 rounded-2xl bg-[#070B14]/60 border border-white/5 space-y-1">
                    <p className="font-bold text-white text-sm">Entry Fees & Permits</p>
                    <p>{guide.visitorInfo.entryFees}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#070B14]/60 border border-white/5 space-y-1">
                    <p className="font-bold text-white text-sm">Nearest Airport & Rail</p>
                    <p>{guide.visitorInfo.nearestAirport}</p>
                    <p>{guide.visitorInfo.nearestRailway}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#070B14]/60 border border-white/5 space-y-1">
                    <p className="font-bold text-white text-sm">Road & Safety Guidelines</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {guide.visitorInfo.safetyTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column (4 cols): AI Travel Concierge Assistant */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel-glow rounded-3xl p-6 flex flex-col h-[560px]">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2 rounded-xl bg-[#42E8D8]/10 text-[#42E8D8]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#F5F7FB] font-display">AI Travel Concierge</h3>
                  <p className="text-[11px] text-[#9BA9BD] font-mono">Guide for {guide.name}</p>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#42E8D8] text-[#070B14] font-semibold ml-6 rounded-tr-sm shadow-md'
                        : 'bg-[#070B14]/80 text-[#F5F7FB] mr-6 rounded-tl-sm border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {asking && (
                  <div className="p-3.5 rounded-2xl bg-[#070B14]/80 text-[#42E8D8] mr-6 text-xs animate-pulse font-mono">
                    Querying geographical data...
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskAssistant} className="pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`Ask about ${guide.name}...`}
                  className="flex-1 px-3.5 py-3 rounded-xl bg-[#070B14] border border-white/10 text-[#F5F7FB] placeholder-[#9BA9BD]/50 text-xs focus:outline-none focus:border-[#42E8D8] font-sans"
                />
                <button
                  type="submit"
                  disabled={asking || !question.trim()}
                  className="p-3 rounded-xl bg-[#42E8D8] hover:bg-[#8AF7EF] text-[#070B14] disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
