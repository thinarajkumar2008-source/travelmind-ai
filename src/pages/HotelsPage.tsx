import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Hotel as HotelIcon, Star, MapPin, Compass, Check, ExternalLink, Filter, Bookmark } from 'lucide-react'
import { api } from '../lib/api'
import { Hotel } from '../types'
import { savedPlaceService } from '../services/savedPlaceService'
import { useAuth } from '../context/AuthContext'

export default function HotelsPage() {
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('destination') || 'munnar'

  const { user } = useAuth()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [savedHotelIds, setSavedHotelIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHotels() {
      setLoading(true)
      const data = await api.getHotels(destinationId)
      setHotels(data)
      
      if (user?.id) {
        const saved = await savedPlaceService.getSavedPlaces(user.id, 'hotel')
        setSavedHotelIds(saved.map(s => s.place_name))
      }
      setLoading(false)
    }
    loadHotels()
  }, [destinationId, user?.id])

  const categories = ['all', 'Luxury', 'Resort', 'Homestay', 'Boutique']
  const filteredHotels = selectedCategory === 'all' 
    ? hotels 
    : hotels.filter(h => h.category.toLowerCase() === selectedCategory.toLowerCase())

  const toggleSaveHotel = async (hotel: Hotel) => {
    if (!user?.id) return
    const isSaved = savedHotelIds.includes(hotel.name)
    if (isSaved) {
      await savedPlaceService.unsavePlace(user.id, hotel.name, 'hotel')
      setSavedHotelIds(prev => prev.filter(x => x !== hotel.name))
    } else {
      await savedPlaceService.savePlace(user.id, {
        destinationId: hotel.destinationId,
        placeName: hotel.name,
        placeType: 'hotel',
        address: hotel.address,
        rating: hotel.rating,
        priceLevel: `$${hotel.pricePerNight}`,
        imageUrl: hotel.imageUrl,
      })
      setSavedHotelIds(prev => [...prev, hotel.name])
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <Link to={`/destination/${destinationId}`} className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to {destinationId.toUpperCase()} Travel Guide
          </Link>
          <span className="text-xs text-navy-400">Verified Accommodation Finder</span>
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
              <HotelIcon className="w-7 h-7 text-teal-400" />
              Hotels & Resorts in {destinationId.charAt(0).toUpperCase() + destinationId.slice(1)}
            </h1>
            <p className="text-sm text-navy-400 mt-1">
              Top accommodations near identified landmarks, with verified amenities & transparent rates.
            </p>
          </div>

          {/* Category Filter Chips */}
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

        {/* Hotel Cards Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => {
              const isSaved = savedHotelIds.includes(hotel.name)
              return (
                <div 
                  key={hotel.id}
                  className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-xs font-bold text-teal-300">
                        {hotel.category}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur text-xs font-semibold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {hotel.rating}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-white">{hotel.name}</h3>
                        <p className="text-xs text-navy-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          {hotel.distanceKm} km from center · {hotel.address}
                        </p>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 3).map((am) => (
                          <span key={am} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-navy-300">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-navy-400">Nightly from</span>
                      <p className="text-lg font-bold text-teal-400">${hotel.pricePerNight} <span className="text-xs text-navy-400">USD</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveHotel(hotel)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isSaved ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-white/5 border-white/10 text-navy-300 hover:text-white'
                        }`}
                        title="Save to trip"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md flex items-center gap-1"
                      >
                        Book <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
