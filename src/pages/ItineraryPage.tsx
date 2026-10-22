import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  Calendar as CalendarIcon, 
  Compass, 
  Sparkles, 
  Clock, 
  MapPin, 
  UtensilsCrossed, 
  Printer, 
  Bookmark, 
  RefreshCw, 
  Users, 
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Map as MapIcon
} from 'lucide-react'
import { api } from '../lib/api'
import { Itinerary, ItineraryDay } from '../types'
import { POPULAR_DESTINATIONS } from '../lib/constants'
import { itineraryService } from '../services/itineraryService'
import { useAuth } from '../context/AuthContext'
import TravelMap, { MapPlace } from '../components/map/TravelMap'
import { MOCK_ATTRACTIONS } from '../lib/mockData'

export default function ItineraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialDest = searchParams.get('destination') || 'munnar'

  const { user } = useAuth()
  const [selectedDestId, setSelectedDestId] = useState(initialDest)
  const [durationDays, setDurationDays] = useState(3)
  const [travelersCount, setTravelersCount] = useState(2)
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'packed'>('moderate')
  const [budgetCategory, setBudgetCategory] = useState<'budget' | 'moderate' | 'luxury'>('moderate')
  const [tripNotes, setTripNotes] = useState('')
  const [activeView, setActiveView] = useState<'schedule' | 'map'>('schedule')
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [generating, setGenerating] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const currentDest = POPULAR_DESTINATIONS.find(d => d.id === selectedDestId) || POPULAR_DESTINATIONS[0]

  const handleGenerate = async () => {
    setGenerating(true)
    const itin = await api.generateItinerary({
      destinationId: selectedDestId,
      destinationName: currentDest.name,
      durationDays,
      travelersCount,
      pace,
      budgetCategory,
    })
    setItinerary(itin)
    setGenerating(false)
  }

  useEffect(() => {
    handleGenerate()
  }, [selectedDestId])

  const handleDestinationChange = (newDestId: string) => {
    setSelectedDestId(newDestId)
    setSearchParams({ destination: newDestId })
  }

  const handleSaveItinerary = async () => {
    if (!itinerary) return
    const userId = user?.id || 'local-guest-user'
    await itineraryService.saveItinerary(userId, {
      ...itinerary,
      notes: tripNotes
    } as any)
    setSavedSuccess(true)
    showToast('Itinerary saved to your trips!')
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  // Convert itinerary places to MapPlaces
  const itineraryMapPlaces: MapPlace[] = useMemo(() => {
    const list: MapPlace[] = [
      {
        id: `dest-${currentDest.id}`,
        name: currentDest.name,
        category: 'destination',
        subCategory: 'Destination Hub',
        latitude: currentDest.latitude,
        longitude: currentDest.longitude,
        address: `${currentDest.location}, ${currentDest.country}`,
        image: currentDest.image,
        description: currentDest.description,
      }
    ]

    const attractions = MOCK_ATTRACTIONS[selectedDestId] || []
    attractions.forEach(a => {
      list.push({
        id: a.id,
        name: a.name,
        category: 'attraction',
        subCategory: a.category,
        latitude: a.coordinates.lat,
        longitude: a.coordinates.lng,
        address: `${currentDest.name} Region`,
        rating: a.rating,
        image: a.imageUrl,
        description: a.description,
      })
    })

    return list
  }, [selectedDestId, currentDest])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal-500 text-white shadow-2xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link to={`/destination/${selectedDestId}`} className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to {currentDest.name} Travel Guide
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveItinerary}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              {savedSuccess ? 'Saved to Trips!' : 'Save Itinerary'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            AI Smart Trip Optimizer (₹0 Free)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Custom Itinerary: {currentDest.name}
          </h1>
          <p className="text-xs sm:text-sm text-navy-300 max-w-xl mx-auto leading-relaxed">
            Optimized for sightseeing hours, mountain transit times, and your preferred travel pace. No booking fees or paid API keys.
          </p>
        </div>

        {/* Customization Controls Strip */}
        <div className="p-6 rounded-3xl bg-navy-900/90 border border-white/10 shadow-xl grid sm:grid-cols-5 gap-4">
          {/* Destination Selector */}
          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Destination</label>
            <select
              value={selectedDestId}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-medium"
            >
              {POPULAR_DESTINATIONS.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.country})</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Duration</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-medium"
            >
              {[1, 2, 3, 4, 5, 7].map(d => (
                <option key={d} value={d}>{d} Days</option>
              ))}
            </select>
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Travelers</label>
            <select
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-medium"
            >
              {[1, 2, 3, 4, 6].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Solo' : 'Travelers'}</option>
              ))}
            </select>
          </div>

          {/* Pace */}
          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Travel Pace</label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as any)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 capitalize font-medium"
            >
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="packed">Packed & Active</option>
            </select>
          </div>

          {/* Regenerate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Rebuilding...' : 'Regenerate'}
            </button>
          </div>
        </div>

        {/* View Mode Switcher (Schedule vs OpenStreetMap Route) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-navy-900 border border-white/10">
            <button
              onClick={() => setActiveView('schedule')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'schedule'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-navy-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Day-by-Day Schedule
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'map'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-navy-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Route on OpenStreetMap
            </button>
          </div>

          <span className="text-xs text-navy-400">
            {durationDays} Days / {travelersCount} Traveler{travelersCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* Map View */}
        {activeView === 'map' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-navy-900/80 border border-white/10 flex items-center justify-between text-xs text-navy-300">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                Plotting itinerary highlights and attractions around {currentDest.name}
              </span>
              <span className="text-teal-400 font-semibold">100% Free OpenStreetMap</span>
            </div>
            <TravelMap
              places={itineraryMapPlaces}
              center={[currentDest.latitude, currentDest.longitude]}
              zoom={12}
              height="550px"
              showFilterBar={true}
              showLegend={true}
              showDetailsPane={true}
            />
          </div>
        )}

        {/* Schedule View */}
        {activeView === 'schedule' && itinerary && (
          <div className="space-y-6">
            {/* Summary Bar */}
            <div className="p-5 rounded-3xl bg-teal-500/10 border border-teal-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{itinerary.title}</h3>
                <p className="text-xs text-teal-300 mt-0.5">
                  Estimated Total Trip Expense: ${itinerary.totalEstimatedCost} USD for {itinerary.travelersCount} travelers (Accommodations + Dining + Entry)
                </p>
              </div>
              <span className="text-xs px-3.5 py-1.5 rounded-full bg-teal-500 text-white font-bold shadow-md">
                {itinerary.durationDays} Days / {itinerary.durationDays - 1} Nights
              </span>
            </div>

            {/* Daily Schedule Cards */}
            <div className="space-y-6">
              {itinerary.days.map((day) => (
                <div 
                  key={day.dayNumber}
                  className="rounded-3xl bg-navy-900/80 border border-white/10 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-teal-500 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-teal-500/25">
                        D{day.dayNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-base text-white">{day.title}</h4>
                        <p className="text-xs text-teal-400 font-medium">{day.theme}</p>
                      </div>
                    </div>
                    <span className="text-xs text-navy-400 font-medium">
                      Est. Daily: ~${day.estimatedDailyExpense} USD
                    </span>
                  </div>

                  {/* Day Schedule Segments */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {/* Morning */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        🌅 Morning
                      </span>
                      <p className="text-xs text-white font-semibold">{day.morningPlace}</p>
                      <p className="text-xs text-navy-300 leading-relaxed">{day.morningActivity}</p>
                    </div>

                    {/* Afternoon */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                        ☀️ Afternoon
                      </span>
                      <p className="text-xs text-white font-semibold">{day.afternoonPlace}</p>
                      <p className="text-xs text-navy-300 leading-relaxed">{day.afternoonActivity}</p>
                    </div>

                    {/* Evening */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                        🌙 Evening & Dinner
                      </span>
                      <p className="text-xs text-white font-semibold">{day.eveningPlace}</p>
                      <p className="text-xs text-navy-300 leading-relaxed">{day.eveningActivity}</p>
                    </div>
                  </div>

                  {/* Dining recommendation & travel tips */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <span className="flex items-center gap-2 text-navy-300">
                      <UtensilsCrossed className="w-4 h-4 text-teal-400" />
                      Suggested Dinner: <span className="text-white font-semibold">{day.recommendedRestaurant}</span>
                    </span>
                    <span className="text-teal-300 font-medium">
                      💡 Insider Tip: {day.travelTips}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trip Notes Section */}
            <div className="p-6 rounded-3xl bg-navy-900/80 border border-white/10 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-400" />
                Personal Travel Notes
              </h3>
              <textarea
                value={tripNotes}
                onChange={e => setTripNotes(e.target.value)}
                placeholder="Add packing reminders, taxi booking notes, or personal preferences for this trip..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-navy-950 border border-white/10 text-white text-xs placeholder-navy-500 focus:outline-none focus:border-teal-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveItinerary}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Save Notes & Itinerary
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
