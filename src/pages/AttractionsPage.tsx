import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Layers, Star, MapPin, Compass, Clock, DollarSign, Bookmark, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import { Attraction } from '../types'

export default function AttractionsPage() {
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('destination') || 'munnar'

  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAttractions() {
      setLoading(true)
      const data = await api.getAttractions(destinationId)
      setAttractions(data)
      setLoading(false)
    }
    loadAttractions()
  }, [destinationId])

  const categories = ['all', 'National Park', 'Viewpoint', 'Heritage']
  const filtered = selectedCategory === 'all'
    ? attractions
    : attractions.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to={`/destination/${destinationId}`} className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to {destinationId.toUpperCase()} Travel Guide
          </Link>
          <span className="text-xs text-navy-400">Nearby Geolocation Discovery</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Layers className="w-7 h-7 text-teal-400" />
              Tourist Attractions Near {destinationId.charAt(0).toUpperCase() + destinationId.slice(1)}
            </h1>
            <p className="text-sm text-navy-400 mt-1">
              Top viewpoints, protected reserves, and historic sites within driving distance.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedCategory === cat 
                    ? 'bg-teal-500 text-white shadow-md' 
                    : 'bg-white/5 text-navy-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2].map(n => <div key={n} className="h-64 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div 
                key={item.id} 
                className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-teal-500 text-xs font-bold text-white">
                      {item.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur text-xs font-semibold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {item.rating} ({item.reviewsCount})
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-lg text-white">{item.name}</h3>
                    <p className="text-xs text-navy-300 leading-relaxed">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-navy-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        {item.distanceKm} km ({item.travelTimeMinutes} mins)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {item.openingHours}
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 text-teal-300 font-medium">
                        <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                        Entry: {item.entryFee}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${item.coordinates.lat}%2C${item.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    OpenStreetMap Directions
                  </a>
                  <Link
                    to={`/itinerary?destination=${destinationId}`}
                    className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    Add to Itinerary <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
