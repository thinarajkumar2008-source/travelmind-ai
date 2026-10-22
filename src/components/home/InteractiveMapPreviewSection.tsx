import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, MapPin, ArrowRight, Sparkles, Navigation, Globe, Layers } from 'lucide-react'
import TravelMap, { MapPlace } from '../map/TravelMap'
import { POPULAR_DESTINATIONS } from '../../lib/constants'

export default function InteractiveMapPreviewSection() {
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null)

  const mapPlaces: MapPlace[] = POPULAR_DESTINATIONS.map(d => ({
    id: d.id,
    name: d.name,
    category: 'destination',
    subCategory: d.category,
    latitude: d.latitude,
    longitude: d.longitude,
    address: `${d.location}, ${d.country}`,
    rating: d.rating,
    image: d.image,
    description: d.description,
  }))

  return (
    <section className="py-28 bg-[#0B1424] relative overflow-hidden border-t border-white/5">
      {/* Background cartographic texture */}
      <div className="absolute inset-0 carto-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#42E8D8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Atlas Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101D32] border border-[#42E8D8]/30 text-[#42E8D8] text-xs font-mono mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>DIGITAL ATLAS & GEOGRAPHICAL EXPLORER (₹0)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7FB] font-display tracking-tight leading-tight">
              Explore Destinations on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D8] via-[#8AF7EF] to-[#FFB86B]">
                The Interactive Map
              </span>
            </h2>
            <p className="text-[#9BA9BD] text-base mt-2 max-w-2xl leading-relaxed">
              Pan across the globe, zoom into mountainous tea valleys, and inspect tourist hotspots plotted with exact coordinates.
            </p>
          </div>

          <div>
            <Link
              to="/explore-map"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] hover:from-[#8AF7EF] hover:to-[#42E8D8] text-[#070B14] font-bold text-xs tracking-wide shadow-xl shadow-[#42E8D8]/20 transition-all cursor-pointer"
            >
              <span>Open Fullscreen Atlas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Embedded Leaflet OpenStreetMap Container */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl">
          {/* Cartographic Coordinate Frame Header */}
          <div className="p-3 sm:px-6 bg-[#070B14]/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#9BA9BD]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#42E8D8]">
                <span className="w-2 h-2 rounded-full bg-[#42E8D8] animate-ping" />
                ONLINE ATLAS
              </span>
              <span>•</span>
              <span>PROJECTION: EPSG:3857 (WGS 84)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#42E8D8]">
              <Layers className="w-3.5 h-3.5" />
              <span>OpenStreetMap & Leaflet · Free Tier</span>
            </div>
          </div>

          <TravelMap
            places={mapPlaces}
            center={[20.5937, 78.9629]}
            zoom={4}
            height="540px"
            showFilterBar={true}
            showLegend={true}
            showDetailsPane={true}
            onSelectPlace={p => setSelectedPlace(p)}
          />
        </div>

        {/* Quick Route Cards Below Map */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_DESTINATIONS.slice(0, 4).map(d => (
            <Link
              key={d.id}
              to={`/destination/${d.id}`}
              className="group p-4 rounded-2xl glass-panel border border-white/5 hover:border-[#42E8D8]/40 transition-all flex items-center gap-3.5 cursor-pointer"
            >
              <img
                src={d.image}
                alt={d.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-[#F5F7FB] font-bold text-sm truncate group-hover:text-[#42E8D8] transition-colors">
                  {d.name}
                </h4>
                <p className="text-[#9BA9BD] text-xs truncate">{d.location}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9BA9BD] group-hover:text-[#42E8D8] group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
