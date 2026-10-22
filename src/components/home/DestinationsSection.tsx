import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, ArrowRight, Compass, Sparkles, Navigation } from 'lucide-react'
import { POPULAR_DESTINATIONS } from '../../lib/constants'

export default function DestinationsSection() {
  const navigate = useNavigate()

  const featured = POPULAR_DESTINATIONS[0] // Munnar (Large Feature)
  const tallCard = POPULAR_DESTINATIONS[2] // Kyoto (Tall Culture Card)
  const wideCard = POPULAR_DESTINATIONS[1] // Bali (Wide Tropical Card)
  const remaining = POPULAR_DESTINATIONS.slice(3) // Ooty, Goa, Jaipur, Alps, Amalfi

  return (
    <section id="destinations" className="py-28 bg-[#070B14] relative overflow-hidden border-t border-white/5">
      {/* Background cartographic lines */}
      <div className="absolute inset-0 carto-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#42E8D8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1424] border border-[#42E8D8]/30 text-[#42E8D8] text-xs font-mono mb-4 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-[#42E8D8]" />
              <span>CURATED ATLAS · VOLUME 01</span>
            </div>
            {/* Required Section Title */}
            <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7FB] font-display tracking-tight leading-tight">
              The World Is Full of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D8] via-[#8AF7EF] to-[#FFB86B]">
                Hidden Stories
              </span>
              .
            </h2>
            <p className="text-[#9BA9BD] text-base mt-3 max-w-2xl leading-relaxed">
              Every travel clip captures a unique slice of geography, culture, and architecture. Explore places identified by our AI intelligence.
            </p>
          </div>

          <button
            onClick={() => navigate('/explore-map')}
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#42E8D8] hover:text-[#8AF7EF] transition-colors cursor-pointer"
          >
            <span>View All on Digital Atlas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Editorial Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: Large Feature Hero Card (Munnar) - 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate(`/destination/${featured.id}`)}
            className="md:col-span-7 group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#42E8D8]/50 shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[440px]"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={featured.image}
                alt={featured.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#070B14]/80 backdrop-blur-md border border-white/15 text-[#42E8D8] text-xs font-mono">
                {featured.category} · Western Ghats
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070B14]/80 backdrop-blur-md border border-white/15 text-[#FFB86B] text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#FFB86B]" />
                <span>{featured.rating}</span>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-6 sm:p-8 space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FB] font-display group-hover:text-[#42E8D8] transition-colors">
                  {featured.name}
                </h3>
                <span className="text-xs font-mono text-[#9BA9BD]">{featured.country}</span>
              </div>
              <p className="text-sm text-[#F5F7FB]/80 max-w-xl line-clamp-2 leading-relaxed">
                {featured.description}
              </p>
              <div className="pt-3 flex items-center gap-4 text-xs font-mono text-[#42E8D8]">
                <span>10.0889° N, 77.0595° E</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Explore Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Tall Photographic Card (Kyoto) - 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => navigate(`/destination/${tallCard.id}`)}
            className="md:col-span-5 group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#42E8D8]/50 shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[440px]"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={tallCard.image}
                alt={tallCard.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#070B14]/80 backdrop-blur-md border border-white/15 text-[#8AF7EF] text-xs font-mono">
                {tallCard.category}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070B14]/80 backdrop-blur-md border border-white/15 text-[#FFB86B] text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#FFB86B]" />
                <span>{tallCard.rating}</span>
              </div>
            </div>

            <div className="relative z-10 p-6 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] font-display group-hover:text-[#42E8D8] transition-colors">
                {tallCard.name}
              </h3>
              <p className="text-xs text-[#9BA9BD]">{tallCard.location}</p>
              <p className="text-xs text-[#F5F7FB]/80 line-clamp-2 leading-relaxed">
                {tallCard.description}
              </p>
              <div className="pt-2 text-xs font-mono text-[#42E8D8] flex items-center gap-1">
                <span>Discover Ancient Temples</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Wide Editorial Banner (Bali) - 12 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onClick={() => navigate(`/destination/${wideCard.id}`)}
            className="md:col-span-12 group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#42E8D8]/50 shadow-2xl transition-all duration-500 cursor-pointer"
          >
            <div className="grid md:grid-cols-12 items-center">
              <div className="md:col-span-7 h-64 md:h-80 overflow-hidden relative">
                <img
                  src={wideCard.image}
                  alt={wideCard.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B1424] hidden md:block" />
              </div>
              <div className="md:col-span-5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#42E8D8]/10 border border-[#42E8D8]/20 text-[#42E8D8] text-xs font-mono">
                    {wideCard.category}
                  </span>
                  <span className="text-xs text-[#9BA9BD] font-mono">INDONESIA</span>
                </div>
                <h3 className="text-3xl font-extrabold text-[#F5F7FB] font-display group-hover:text-[#42E8D8] transition-colors">
                  {wideCard.name}
                </h3>
                <p className="text-sm text-[#9BA9BD] leading-relaxed">
                  {wideCard.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {wideCard.highlights.map(h => (
                    <span key={h} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[#F5F7FB]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards 4-8: Compact Exploration Grid (Ooty, Goa, Jaipur, Alps, Amalfi) */}
          {remaining.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => navigate(`/destination/${dest.id}`)}
              className="md:col-span-4 lg:col-span-4 group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#42E8D8]/50 shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1424] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#070B14]/80 backdrop-blur-md text-[#42E8D8] text-[10px] font-mono border border-white/15">
                  {dest.category}
                </span>
                <div className="absolute bottom-3 right-4 flex items-center gap-1 text-xs text-[#FFB86B] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#FFB86B]" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-[#F5F7FB] font-display group-hover:text-[#42E8D8] transition-colors">
                      {dest.name}
                    </h4>
                    <p className="text-xs text-[#9BA9BD]">{dest.location}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#9BA9BD] group-hover:text-[#42E8D8] group-hover:translate-x-1 transition-all mt-1" />
                </div>
                <p className="text-xs text-[#9BA9BD] line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}
