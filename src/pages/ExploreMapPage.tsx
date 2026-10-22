import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import TravelMap, { MapPlace, MarkerCategory } from '../components/map/TravelMap'
import { POPULAR_DESTINATIONS, DestinationItem } from '../lib/constants'
import { MOCK_HOTELS, MOCK_RESTAURANTS, MOCK_ATTRACTIONS } from '../lib/mockData'
import { useAuth } from '../context/AuthContext'
import { savedPlaceService } from '../services/savedPlaceService'
import {
  Search,
  MapPin,
  Camera,
  Hotel,
  UtensilsCrossed,
  Heart,
  Navigation,
  Compass,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Star,
  Info,
  CheckCircle2,
  Globe2,
  Layers
} from 'lucide-react'

export default function ExploreMapPage() {
  const { user } = useAuth()
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem>(POPULAR_DESTINATIONS[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<MarkerCategory | 'all'>('all')
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null)
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set())
  const [isSearchingNominatim, setIsSearchingNominatim] = useState(false)
  const [customNominatimPlaces, setCustomNominatimPlaces] = useState<MapPlace[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const allMapPlaces = useMemo(() => {
    const list: MapPlace[] = []

    POPULAR_DESTINATIONS.forEach(dest => {
      list.push({
        id: `dest-${dest.id}`,
        name: dest.name,
        category: 'destination',
        subCategory: dest.category,
        latitude: dest.latitude,
        longitude: dest.longitude,
        address: `${dest.location}, ${dest.country}`,
        rating: dest.rating,
        image: dest.image,
        description: dest.description,
        isSaved: savedPlaceIds.has(`dest-${dest.id}`),
      })
    })

    Object.entries(MOCK_HOTELS).forEach(([destId, hotels]) => {
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
          isSaved: savedPlaceIds.has(h.id),
        })
      })
    })

    Object.entries(MOCK_RESTAURANTS).forEach(([destId, restaurants]) => {
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
          priceLevel: r.priceLevel,
          isSaved: savedPlaceIds.has(r.id),
        })
      })
    })

    Object.entries(MOCK_ATTRACTIONS).forEach(([destId, attractions]) => {
      attractions.forEach(a => {
        list.push({
          id: a.id,
          name: a.name,
          category: 'attraction',
          subCategory: a.category,
          latitude: a.coordinates.lat,
          longitude: a.coordinates.lng,
          address: `${selectedDestination.name} Region`,
          rating: a.rating,
          image: a.imageUrl,
          description: a.description,
          isSaved: savedPlaceIds.has(a.id),
        })
      })
    })

    customNominatimPlaces.forEach(p => list.push(p))
    return list
  }, [selectedDestination, savedPlaceIds, customNominatimPlaces])

  const filteredPlaces = useMemo(() => {
    return allMapPlaces.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesQuery = !query ||
        p.name.toLowerCase().includes(query) ||
        (p.address && p.address.toLowerCase().includes(query)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(query))
      return matchesCategory && matchesQuery
    })
  }, [allMapPlaces, activeCategory, searchQuery])

  const handleFreeOSMSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearchingNominatim(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=3`,
        { headers: { 'Accept-Language': 'en' } }
      )
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          const first = data[0]
          const lat = parseFloat(first.lat)
          const lon = parseFloat(first.lon)
          const newPlace: MapPlace = {
            id: `osm-${first.place_id}`,
            name: first.name || searchQuery,
            category: 'destination',
            subCategory: first.type || 'Location',
            latitude: lat,
            longitude: lon,
            address: first.display_name,
            description: 'Geocoded via OpenStreetMap Nominatim.',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
          }
          setCustomNominatimPlaces(prev => [newPlace, ...prev])
          setSelectedPlace(newPlace)
          showToast(`Found "${newPlace.name}" on OpenStreetMap!`)
        } else {
          showToast(`No exact match on OpenStreetMap for "${searchQuery}".`)
        }
      }
    } catch (err) {
      console.warn('Free OSM geocoding error:', err)
      showToast('Could not reach OpenStreetMap geocoding. Using local database.')
    } finally {
      setIsSearchingNominatim(false)
    }
  }

  const handleToggleSave = async (place: MapPlace) => {
    const isCurrentlySaved = savedPlaceIds.has(place.id)
    const nextSaved = new Set(savedPlaceIds)

    if (isCurrentlySaved) {
      nextSaved.delete(place.id)
      setSavedPlaceIds(nextSaved)
      showToast(`Removed "${place.name}" from saved places.`)
    } else {
      nextSaved.add(place.id)
      setSavedPlaceIds(nextSaved)
      showToast(`Saved "${place.name}" to your bucket list!`)

      if (user) {
        await savedPlaceService.savePlace(user.id, {
          destinationId: selectedDestination.id,
          providerPlaceId: place.id,
          placeName: place.name,
          placeType: place.category === 'hotel' ? 'hotel' : place.category === 'restaurant' ? 'restaurant' : 'attraction',
          address: place.address,
          latitude: place.latitude,
          longitude: place.longitude,
          imageUrl: place.image,
          rating: place.rating,
          priceLevel: place.priceLevel,
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F7FB] flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Cartographic lines in background */}
      <div className="absolute inset-0 carto-grid opacity-20 pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#42E8D8] text-[#070B14] shadow-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 font-bold" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1424] border border-[#42E8D8]/30 text-[#42E8D8] text-xs font-mono mb-3">
              <Globe2 className="w-3.5 h-3.5 text-[#42E8D8]" />
              <span>INTERACTIVE DIGITAL ATLAS · ZERO COST (₹0)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#F5F7FB] font-display tracking-tight leading-tight">
              Explore Destinations on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D8] via-[#8AF7EF] to-[#FFB86B]">
                OpenStreetMap
              </span>
            </h1>
            <p className="text-[#9BA9BD] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore landmarks, accommodations, and culinary hotspots using open geographic data powered by Leaflet. Zero Google Maps billing.
            </p>
          </div>

          <div>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] hover:from-[#8AF7EF] hover:to-[#42E8D8] text-[#070B14] text-xs font-bold tracking-wide shadow-lg shadow-[#42E8D8]/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Video
            </Link>
          </div>
        </div>

        {/* Quick Destination Teleport Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <span className="text-xs font-mono text-[#9BA9BD] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Compass className="w-3.5 h-3.5 text-[#42E8D8]" />
            Teleport:
          </span>
          {POPULAR_DESTINATIONS.map(dest => (
            <button
              key={dest.id}
              onClick={() => {
                setSelectedDestination(dest)
                setSelectedPlace({
                  id: `dest-${dest.id}`,
                  name: dest.name,
                  category: 'destination',
                  subCategory: dest.category,
                  latitude: dest.latitude,
                  longitude: dest.longitude,
                  address: `${dest.location}, ${dest.country}`,
                  rating: dest.rating,
                  image: dest.image,
                  description: dest.description,
                })
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedDestination.id === dest.id
                  ? 'bg-[#42E8D8] text-[#070B14] font-bold shadow-md ring-2 ring-[#8AF7EF]'
                  : 'bg-[#0B1424] text-[#9BA9BD] hover:text-[#F5F7FB] border border-white/5'
              }`}
            >
              <span>{dest.name}</span>
              <span className="text-[10px] font-mono opacity-70">({dest.country})</span>
            </button>
          ))}
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel mb-6">
          <form onSubmit={handleFreeOSMSearch} className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9BA9BD]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search places or geocode any city via OpenStreetMap..."
              className="w-full pl-11 pr-24 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-[#F5F7FB] text-xs sm:text-sm placeholder-[#9BA9BD]/50 focus:outline-none focus:border-[#42E8D8] transition-all font-mono"
            />
            <button
              type="submit"
              disabled={isSearchingNominatim || !searchQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#42E8D8] text-[#070B14] disabled:opacity-40 text-xs font-bold transition-all cursor-pointer"
            >
              {isSearchingNominatim ? 'Finding...' : 'Geocode'}
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All', icon: Layers },
              { id: 'destination', label: 'Destinations', icon: MapPin },
              { id: 'attraction', label: 'Attractions', icon: Camera },
              { id: 'hotel', label: 'Hotels', icon: Hotel },
              { id: 'restaurant', label: 'Dining', icon: UtensilsCrossed },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === id
                    ? 'bg-[#42E8D8] text-[#070B14] font-bold shadow-md'
                    : 'bg-[#070B14] text-[#9BA9BD] hover:text-[#F5F7FB] border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Split Grid: Places Sidebar (5 cols) + Leaflet Atlas (7 cols) */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Places List */}
          <div className="lg:col-span-5 space-y-3.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            <div className="flex items-center justify-between px-2 text-xs font-mono text-[#9BA9BD]">
              <span>Showing {filteredPlaces.length} locations near {selectedDestination.name}</span>
              <span>Click card to center</span>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="p-8 text-center rounded-2xl glass-panel text-[#9BA9BD]">
                <Compass className="w-10 h-10 mx-auto mb-2 text-[#42E8D8] opacity-50" />
                <p className="font-bold text-[#F5F7FB]">No locations found</p>
                <p className="text-xs mt-1">Try another category or geocode a new city.</p>
              </div>
            ) : (
              filteredPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPlace?.id === place.id
                      ? 'bg-[#101D32] border-[#42E8D8] shadow-xl shadow-[#42E8D8]/10'
                      : 'glass-panel border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-4">
                    {place.image && (
                      <div className="w-22 h-22 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#42E8D8]/10 text-[#42E8D8] border border-[#42E8D8]/20">
                            {place.subCategory || place.category}
                          </span>
                          {place.rating && (
                            <span className="flex items-center gap-1 text-xs font-bold text-[#FFB86B]">
                              <Star className="w-3 h-3 fill-[#FFB86B]" />
                              {place.rating}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-[#F5F7FB] text-sm truncate mt-1 font-display">
                          {place.name}
                        </h3>
                        {place.address && (
                          <p className="text-xs text-[#9BA9BD] truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#42E8D8] shrink-0" />
                            {place.address}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/5 text-xs">
                        <a
                          href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${place.latitude}%2C${place.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[#42E8D8] hover:text-[#8AF7EF] font-bold text-[11px]"
                        >
                          <Navigation className="w-3 h-3" />
                          Directions
                        </a>
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleToggleSave(place)
                          }}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            place.isSaved
                              ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                              : 'bg-white/5 border-white/10 text-[#9BA9BD] hover:text-[#F5F7FB]'
                          }`}
                          title="Save to bucket list"
                        >
                          <Heart className={`w-3.5 h-3.5 ${place.isSaved ? 'fill-rose-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Interactive Leaflet Atlas */}
          <div className="lg:col-span-7 sticky top-28">
            <TravelMap
              places={filteredPlaces}
              center={[
                selectedPlace ? selectedPlace.latitude : selectedDestination.latitude,
                selectedPlace ? selectedPlace.longitude : selectedDestination.longitude
              ]}
              zoom={13}
              height="650px"
              onSelectPlace={place => setSelectedPlace(place)}
              onToggleSave={handleToggleSave}
              showFilterBar={true}
              showLegend={true}
              showDetailsPane={true}
            />

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#9BA9BD] font-mono px-2">
              <div className="flex items-center gap-1.5 text-[#42E8D8]">
                <Info className="w-3.5 h-3.5" />
                <span>Zero-Cost: Powered by Leaflet & OpenStreetMap contributors.</span>
              </div>
              <span>No Google Maps API billing</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
