import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Compass, Trash2, ArrowRight, MapPin, Calendar, Hotel, UtensilsCrossed, Star } from 'lucide-react'
import { api } from '../lib/api'
import { SavedTrip } from '../types'
import { savedPlaceService, SavedPlaceRecord } from '../services/savedPlaceService'
import { useAuth } from '../context/AuthContext'

export default function SavedTripsPage() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceRecord[]>([])
  const [activeTab, setActiveTab] = useState<'destinations' | 'places'>('destinations')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const [tripsData, placesData] = await Promise.all([
      api.getSavedTrips(),
      user?.id ? savedPlaceService.getSavedPlaces(user.id) : []
    ])
    setTrips(tripsData)
    setSavedPlaces(placesData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  const handleDeleteDestination = async (id: string) => {
    if (window.confirm('Remove this destination from your saved trips?')) {
      await api.deleteTrip(id)
      loadData()
    }
  }

  const handleDeletePlace = async (placeName: string, placeType: string) => {
    if (user?.id && window.confirm(`Remove ${placeName} from saved places?`)) {
      await savedPlaceService.unsavePlace(user.id, placeName, placeType)
      loadData()
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs text-navy-400">Persistent Supabase PostgreSQL Storage</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Bookmark className="w-7 h-7 text-teal-400" />
              Saved Trips & Places
            </h1>
            <p className="text-sm text-navy-400 mt-1">
              Your personal bucket list of destinations and accommodations saved across sessions.
            </p>
          </div>

          <div className="flex bg-navy-900 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('destinations')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'destinations' ? 'bg-teal-500 text-white shadow-md' : 'text-navy-400 hover:text-white'
              }`}
            >
              Destinations ({trips.length})
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'places' ? 'bg-teal-500 text-white shadow-md' : 'text-navy-400 hover:text-white'
              }`}
            >
              Saved Places ({savedPlaces.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => <div key={n} className="h-32 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : activeTab === 'destinations' ? (
          trips.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
              <Bookmark className="w-12 h-12 text-navy-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No saved destinations yet</h3>
              <p className="text-xs text-navy-400 mt-1 max-w-sm mx-auto">
                Explore destinations identified in travel reels and click "Save Destination".
              </p>
              <Link to="/analyze" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-bold">
                Discover Destinations
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div 
                  key={trip.id}
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-teal-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img src={trip.coverImage} alt={trip.destinationName} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[11px] text-teal-400 font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {trip.stateOrRegion}, {trip.country}
                      </span>
                      <h3 className="font-extrabold text-lg text-white">{trip.destinationName}</h3>
                      {trip.notes && (
                        <p className="text-xs text-navy-300 max-w-md">{trip.notes}</p>
                      )}
                      {trip.plannedDates && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-navy-400 pt-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-400" />
                          {trip.plannedDates}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={() => handleDeleteDestination(trip.id)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-navy-400 hover:text-red-400 transition-colors"
                      title="Remove saved item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/destination/${trip.destinationId}`}
                      className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                    >
                      Open Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          savedPlaces.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
              <Hotel className="w-12 h-12 text-navy-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No saved places yet</h3>
              <p className="text-xs text-navy-400 mt-1 max-w-sm mx-auto">
                Visit the Hotel or Restaurant finder and click the bookmark icon to save places.
              </p>
              <Link to="/hotels" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-bold">
                Find Hotels
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {savedPlaces.map((place) => (
                <div key={place.id} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                      {place.place_type === 'hotel' ? <Hotel className="w-5 h-5" /> : <UtensilsCrossed className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{place.place_name}</h4>
                      <p className="text-xs text-navy-400 truncate">{place.address || 'Verified place'}</p>
                      {place.price_level && <span className="text-[10px] text-teal-300 font-semibold">{place.price_level}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePlace(place.place_name, place.place_type)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-navy-400 hover:text-red-400 shrink-0"
                    title="Remove place"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
