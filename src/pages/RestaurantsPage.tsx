import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { UtensilsCrossed, Star, MapPin, Compass, Clock, Check, Phone } from 'lucide-react'
import { api } from '../lib/api'
import { Restaurant } from '../types'

export default function RestaurantsPage() {
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('destination') || 'munnar'

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [vegetarianOnly, setVegetarianOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRestaurants() {
      setLoading(true)
      const data = await api.getRestaurants(destinationId)
      setRestaurants(data)
      setLoading(false)
    }
    loadRestaurants()
  }, [destinationId])

  const filtered = vegetarianOnly 
    ? restaurants.filter(r => r.isVegetarianFriendly || r.isPureVeg) 
    : restaurants

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to={`/destination/${destinationId}`} className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to {destinationId.toUpperCase()} Travel Guide
          </Link>
          <span className="text-xs text-navy-400">Authentic Local Gastronomy</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
              <UtensilsCrossed className="w-7 h-7 text-teal-400" />
              Restaurants & Dining in {destinationId.charAt(0).toUpperCase() + destinationId.slice(1)}
            </h1>
            <p className="text-sm text-navy-400 mt-1">
              Curated dining spots, Kerala spices, and street tea corners near tourist routes.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-medium w-fit">
            <input
              type="checkbox"
              checked={vegetarianOnly}
              onChange={(e) => setVegetarianOnly(e.target.checked)}
              className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 bg-navy-900"
            />
            <span>Vegetarian Friendly Only</span>
          </label>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rest) => (
              <div 
                key={rest.id} 
                className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={rest.imageUrl} alt={rest.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-xs font-bold text-teal-300">
                      {rest.priceLevel} · ~${rest.approxMealForTwo} for 2
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur text-xs font-semibold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rest.rating}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-white">{rest.name}</h3>
                      <p className="text-xs text-navy-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        {rest.address}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {rest.cuisine.map((c) => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-medium">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="pt-1">
                      <p className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1">Must Try:</p>
                      <p className="text-xs text-navy-200">{rest.specialties.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between text-xs text-navy-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    {rest.openingHours}
                  </span>
                  {rest.contactPhone && (
                    <a href={`tel:${rest.contactPhone}`} className="text-teal-400 hover:underline flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
