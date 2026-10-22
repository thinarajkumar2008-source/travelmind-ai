import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Car, 
  Star, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  Navigation, 
  Edit3, 
  Check, 
  X 
} from 'lucide-react'
import { getNearbyDestinationsForPlace } from '../../services/nearbyService'
import { NearbyDestination } from '../../types'

interface NearbyDestinationsSectionProps {
  initialPlace?: string
  userName?: string
  onPlaceChange?: (newPlace: string) => void
  showTitle?: boolean
  compact?: boolean
}

export default function NearbyDestinationsSection({
  initialPlace = 'Kochi, Kerala',
  userName,
  onPlaceChange,
  showTitle = true,
  compact = false,
}: NearbyDestinationsSectionProps) {
  const [currentPlace, setCurrentPlace] = useState(initialPlace)
  const [isEditing, setIsEditing] = useState(false)
  const [tempPlace, setTempPlace] = useState(initialPlace)

  // Compute nearby destinations dynamically based on current place
  const { resolvedLocation, destinations } = React.useMemo(() => {
    return getNearbyDestinationsForPlace(currentPlace, compact ? 4 : 6)
  }, [currentPlace, compact])

  const handleSavePlace = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (tempPlace.trim()) {
      setCurrentPlace(tempPlace.trim())
      setIsEditing(false)
      if (onPlaceChange) {
        onPlaceChange(tempPlace.trim())
      }
    }
  }

  const quickCities = ['Kochi', 'Bengaluru', 'Chennai', 'Coimbatore', 'Mumbai', 'Delhi']

  return (
    <div className="space-y-6">
      {/* Header with Place Switcher */}
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                <Navigation className="w-4 h-4 text-teal-400" />
              </span>
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                Tailored To Your Origin City
              </span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {userName ? `${userName}'s Nearby Travel Escapes` : 'Destinations Near You'}
            </h3>
            <p className="text-xs text-navy-400 mt-0.5">
              Calculating road trips, hill stations, and scenic spots originating from{' '}
              <span className="text-teal-300 font-medium">{resolvedLocation}</span>
            </p>
          </div>

          {/* Location Badge / Quick Change Button */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {isEditing ? (
              <form onSubmit={handleSavePlace} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempPlace}
                  onChange={(e) => setTempPlace(e.target.value)}
                  placeholder="e.g. Kochi, Chennai, Bengaluru..."
                  className="px-3 py-1.5 bg-navy-900 border border-teal-500 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                  title="Save location"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempPlace(currentPlace)
                    setIsEditing(false)
                  }}
                  className="p-1.5 rounded-lg bg-white/10 text-navy-300 hover:text-white"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setTempPlace(currentPlace)
                  setIsEditing(true)
                }}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-medium transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Near {currentPlace}</span>
                <Edit3 className="w-3 h-3 text-teal-400/70 group-hover:text-teal-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick City Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-navy-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Quick Switch Origin:
        </span>
        {quickCities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setCurrentPlace(city)
              setTempPlace(city)
              if (onPlaceChange) onPlaceChange(city)
            }}
            className={`px-3 py-1 rounded-full transition-all shrink-0 ${
              currentPlace.toLowerCase().includes(city.toLowerCase())
                ? 'bg-teal-500 text-white font-semibold shadow-md shadow-teal-500/20'
                : 'bg-white/5 hover:bg-white/10 text-navy-300 border border-white/5'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div className={`grid gap-5 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {destinations.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/5 transition-all flex flex-col"
          >
            {/* Image & Distance Badge */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />

              {/* Driving distance chip */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-md border border-teal-500/30 text-[11px] font-semibold text-teal-300">
                <Car className="w-3.5 h-3.5 text-teal-400" />
                <span>{dest.distanceKm} km away</span>
              </div>

              {/* Category chip */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur text-[10px] text-white font-medium">
                {dest.category}
              </div>

              {/* Rating */}
              <div className="absolute bottom-2 right-3 flex items-center gap-1 text-xs text-amber-300 bg-navy-950/70 px-2 py-0.5 rounded-full border border-white/10">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-bold">{dest.rating}</span>
              </div>
            </div>

            {/* Destination Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  {dest.name}
                </h4>
                <div className="flex items-center gap-1 text-xs text-navy-400 mt-0.5 mb-2">
                  <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                  <span>{dest.stateOrRegion}</span>
                  <span className="mx-1">•</span>
                  <span className="text-teal-400 font-medium">{dest.travelTime}</span>
                </div>
                <p className="text-xs text-navy-300 line-clamp-2 leading-relaxed mb-3">
                  {dest.description}
                </p>

                {/* Highlights tags */}
                {dest.highlights && dest.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {dest.highlights.slice(0, 2).map((hl) => (
                      <span
                        key={hl}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20 truncate max-w-[150px]"
                      >
                        {hl}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <Link
                  to={`/destination/${dest.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Explore Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/itinerary?dest=${dest.id}&from=${encodeURIComponent(currentPlace)}`}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-navy-300 hover:text-white transition-colors"
                >
                  Plan Trip
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
