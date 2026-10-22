import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import {
  MapPin,
  Camera,
  Hotel,
  UtensilsCrossed,
  Heart,
  Navigation,
  Compass,
  Layers,
  ExternalLink,
  X,
  Star,
  Info
} from 'lucide-react'
import { OSM_TILE_URL, OSM_ATTRIBUTION } from '../../lib/constants'

export type MarkerCategory = 'destination' | 'attraction' | 'hotel' | 'restaurant' | 'saved'

export interface MapPlace {
  id: string
  name: string
  category: MarkerCategory
  subCategory?: string
  latitude: number
  longitude: number
  address?: string
  rating?: number
  image?: string
  description?: string
  priceLevel?: string
  isSaved?: boolean
}

interface TravelMapProps {
  places?: MapPlace[]
  center?: [number, number]
  zoom?: number
  height?: string
  className?: string
  onSelectPlace?: (place: MapPlace) => void
  onToggleSave?: (place: MapPlace) => void
  showFilterBar?: boolean
  showLegend?: boolean
  showDetailsPane?: boolean
  interactive?: boolean
}

// Custom SVG HTML Icons for each category matching the brand design system
const createCategoryIcon = (category: MarkerCategory, isSelected: boolean = false) => {
  let bgGradient = 'bg-gradient-to-br from-[#42E8D8] to-[#25C2B4]'
  let borderColor = 'border-[#8AF7EF]'
  let shadowColor = 'shadow-[#42E8D8]/50'
  let iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#070B14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>`

  switch (category) {
    case 'attraction':
      bgGradient = 'bg-gradient-to-br from-[#FFB86B] to-[#E68A2E]'
      borderColor = 'border-[#FFE3BA]'
      shadowColor = 'shadow-[#FFB86B]/50'
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#070B14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
          <circle cx="12" cy="13" r="3"></circle>
        </svg>`
      break
    case 'hotel':
      bgGradient = 'bg-gradient-to-br from-[#6366F1] to-[#4338CA]'
      borderColor = 'border-[#A5B4FC]'
      shadowColor = 'shadow-[#6366F1]/50'
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
          <path d="M2 17h20"></path><path d="M6 8v9"></path>
        </svg>`
      break
    case 'restaurant':
      bgGradient = 'bg-gradient-to-br from-[#10B981] to-[#047857]'
      borderColor = 'border-[#6EE7B7]'
      shadowColor = 'shadow-[#10B981]/50'
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path>
          <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path>
        </svg>`
      break
    case 'saved':
      bgGradient = 'bg-gradient-to-br from-[#F43F5E] to-[#BE123C]'
      borderColor = 'border-[#FDA4AF]'
      shadowColor = 'shadow-[#F43F5E]/50'
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF" stroke="none">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>`
      break
  }

  const pulseClass = isSelected ? 'scale-125 z-50 ring-4 ring-[#42E8D8]' : 'hover:scale-110 shadow-lg'

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center transition-transform duration-200 ${pulseClass}">
        <div class="w-9 h-9 rounded-full ${bgGradient} border-2 ${borderColor} flex items-center justify-center shadow-lg ${shadowColor}">
          ${iconSvg}
        </div>
        <div class="absolute -bottom-1 w-2 h-2 bg-[#070B14] rotate-45 border-r border-b ${borderColor}"></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 40],
    popupAnchor: [0, -36],
  })
}

export default function TravelMap({
  places = [],
  center = [10.0889, 77.0595],
  zoom = 13,
  height = '500px',
  className = '',
  onSelectPlace,
  onToggleSave,
  showFilterBar = true,
  showLegend = true,
  showDetailsPane = true,
  interactive = true,
}: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  const [activeFilter, setActiveFilter] = useState<MarkerCategory | 'all'>('all')
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        scrollWheelZoom: interactive,
        dragging: interactive,
      })

      L.tileLayer(OSM_TILE_URL, {
        attribution: OSM_ATTRIBUTION,
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map)

      const markersGroup = L.layerGroup().addTo(map)
      markersLayerRef.current = markersGroup
      mapInstanceRef.current = map
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true })
    }
  }, [center[0], center[1], zoom])

  useEffect(() => {
    const map = mapInstanceRef.current
    const layer = markersLayerRef.current
    if (!map || !layer) return

    layer.clearLayers()

    const filteredPlaces = places.filter(p => activeFilter === 'all' || p.category === activeFilter)

    filteredPlaces.forEach(place => {
      const isSelected = selectedPlace?.id === place.id
      const icon = createCategoryIcon(place.category, isSelected)
      const marker = L.marker([place.latitude, place.longitude], { icon })

      const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${place.latitude}%2C${place.longitude}`

      const popupHtml = `
        <div class="p-2.5 text-[#070B14] font-sans max-w-xs">
          ${place.image ? `<img src="${place.image}" alt="${place.name}" class="w-full h-24 object-cover rounded-lg mb-2" />` : ''}
          <div class="flex items-start justify-between gap-1">
            <h4 class="font-extrabold text-sm text-[#070B14] leading-tight">${place.name}</h4>
            ${place.rating ? `<span class="inline-flex items-center text-xs font-bold text-[#E68A2E] bg-amber-50 px-1.5 py-0.5 rounded">★ ${place.rating}</span>` : ''}
          </div>
          <p class="text-[11px] text-slate-500 capitalize mt-0.5">${place.subCategory || place.category}</p>
          ${place.description ? `<p class="text-xs text-slate-600 mt-1 line-clamp-2">${place.description}</p>` : ''}
          <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-[#25C2B4] hover:text-[#0d9488]">
              Directions &rarr;
            </a>
            <span class="text-[10px] text-slate-400 font-mono">OpenStreetMap</span>
          </div>
        </div>
      `

      marker.bindPopup(popupHtml)

      marker.on('click', () => {
        setSelectedPlace(place)
        if (onSelectPlace) onSelectPlace(place)
      })

      layer.addLayer(marker)
    })

    if (filteredPlaces.length > 1) {
      const bounds = L.latLngBounds(filteredPlaces.map(p => [p.latitude, p.longitude]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [places, activeFilter, selectedPlace?.id])

  const filterOptions: { id: MarkerCategory | 'all'; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'all', label: 'All', icon: Layers, color: 'text-slate-400' },
    { id: 'destination', label: 'Destinations', icon: MapPin, color: 'text-[#42E8D8]' },
    { id: 'attraction', label: 'Attractions', icon: Camera, color: 'text-[#FFB86B]' },
    { id: 'hotel', label: 'Hotels', icon: Hotel, color: 'text-[#A5B4FC]' },
    { id: 'restaurant', label: 'Dining', icon: UtensilsCrossed, color: 'text-[#6EE7B7]' },
    { id: 'saved', label: 'Saved', icon: Heart, color: 'text-[#FDA4AF]' },
  ]

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#070B14] shadow-2xl ${className}`}>
      {/* Top Filter Bar */}
      {showFilterBar && (
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B1424]/90 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
            {filterOptions.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === id
                    ? 'bg-[#42E8D8] text-[#070B14] shadow-md font-bold'
                    : 'text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeFilter === id ? 'text-[#070B14]' : color}`} />
                <span>{label}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({id === 'all' ? places.length : places.filter(p => p.category === id).length})
                </span>
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B1424]/90 backdrop-blur-xl border border-white/10 text-xs font-mono text-[#42E8D8] pointer-events-auto">
            <Compass className="w-3.5 h-3.5 text-[#42E8D8] animate-spin" style={{ animationDuration: '12s' }} />
            <span>Digital Atlas · OpenStreetMap (₹0)</span>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {/* Map Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0B1424]/90 backdrop-blur-xl border border-white/10 text-xs font-mono shadow-xl">
          <span className="text-[#9BA9BD] text-[10px] uppercase font-bold tracking-wider">Legend:</span>
          <div className="flex items-center gap-1.5 text-[#42E8D8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#42E8D8] shadow-sm shadow-[#42E8D8]/50"></span>
            <span>Destinations</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FFB86B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB86B] shadow-sm shadow-[#FFB86B]/50"></span>
            <span>Attractions</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#A5B4FC]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-sm shadow-[#6366F1]/50"></span>
            <span>Hotels</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6EE7B7]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]/50"></span>
            <span>Dining</span>
          </div>
        </div>
      )}

      {/* Selected Place Detail Overlay */}
      {showDetailsPane && selectedPlace && (
        <div className="absolute bottom-4 right-4 max-w-sm w-full z-[400] p-4 rounded-2xl bg-[#0B1424]/95 backdrop-blur-2xl border border-white/15 text-[#F5F7FB] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setSelectedPlace(null)}
            className="absolute top-3 right-3 p-1 rounded-lg text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/10 cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-3">
            {selectedPlace.image && (
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#42E8D8]/10 text-[#42E8D8] border border-[#42E8D8]/20">
                {selectedPlace.subCategory || selectedPlace.category}
              </span>
              <h4 className="font-extrabold text-[#F5F7FB] text-sm truncate mt-1 font-display">{selectedPlace.name}</h4>
              {selectedPlace.address && (
                <p className="text-xs text-[#9BA9BD] truncate mt-0.5">{selectedPlace.address}</p>
              )}
              {selectedPlace.rating && (
                <div className="flex items-center gap-1 mt-1 text-xs text-[#FFB86B]">
                  <Star className="w-3 h-3 fill-[#FFB86B]" />
                  <span className="font-bold">{selectedPlace.rating}</span>
                </div>
              )}
            </div>
          </div>

          {selectedPlace.description && (
            <p className="text-xs text-[#9BA9BD] mt-2 line-clamp-2 leading-relaxed">
              {selectedPlace.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <a
              href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${selectedPlace.latitude}%2C${selectedPlace.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#42E8D8] hover:bg-[#8AF7EF] text-[#070B14] text-xs font-bold shadow-md shadow-[#42E8D8]/20 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              Directions
            </a>

            {onToggleSave && (
              <button
                onClick={() => onToggleSave(selectedPlace)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  selectedPlace.isSaved
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-white/5 border-white/10 text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/10'
                }`}
                title={selectedPlace.isSaved ? 'Remove from Saved' : 'Save Place'}
              >
                <Heart className={`w-4 h-4 ${selectedPlace.isSaved ? 'fill-rose-400' : ''}`} />
              </button>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name + ' ' + (selectedPlace.address || ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/10 cursor-pointer"
              title="Search place externally"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
