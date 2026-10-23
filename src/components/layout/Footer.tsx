import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Globe, Share2, Mail, ShieldCheck, Heart, Database } from 'lucide-react'
import { SITE_NAME } from '../../lib/constants'
import DataAttributionModal from '../geo/DataAttributionModal'

const footerLinks = {
  Discovery: [
    { label: 'Explore Destinations', href: '/#destinations' },
    { label: 'Analyze Video', href: '/analyze' },
    { label: 'Interactive Atlas', href: '/explore-map' },
    { label: 'Trip Planner', href: '/itinerary' },
  ],
  Platform: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features & Architecture', href: '/#features' },
    { label: 'Saved Collection', href: '/saved-trips' },
    { label: 'Traveler Dashboard', href: '/dashboard' },
  ],
  Transparency: [
    { label: 'Zero-Cost Commitment', href: '/#features' },
    { label: 'GeoNames & OSM Credits', href: '#data-credits', isModal: true },
    { label: 'Leaflet OpenStreetMap', href: 'https://www.openstreetmap.org' },
    { label: 'Open Geocoding Policy', href: 'https://nominatim.openstreetmap.org' },
    { label: 'Privacy & Terms', href: '#' },
  ],
}

export default function Footer() {
  const [showAttributionModal, setShowAttributionModal] = useState(false)

  return (
    <footer className="bg-[#070B14] text-[#F5F7FB] border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 carto-grid opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/travelmind-logo.png"
                alt="TRAVELMIND AI official travel logo"
                className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(255,184,107,0.3)]"
              />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-[#F5F7FB] font-display">
                  TRAVELMIND <span className="text-[#42E8D8]">AI</span>
                </span>
                <span className="text-[10px] text-[#9BA9BD] font-mono tracking-wider uppercase">
                  Cinematic Intelligence
                </span>
              </div>
            </Link>

            <p className="text-[#9BA9BD] text-xs sm:text-sm leading-relaxed max-w-sm">
              Cinematic intelligence for curious travelers. Transforming travel videos into comprehensive destination guides, interactive atlases, and actionable itineraries across 100+ countries.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1424] border border-[#42E8D8]/20 text-[#42E8D8] text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free & Open Source (₹0)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAttributionModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1424] hover:bg-navy-800 border border-teal-500/30 text-teal-300 text-[11px] font-mono transition-colors"
              >
                <Database className="w-3 h-3 text-teal-400" />
                <span>126 Countries Data</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              {[
                { icon: Globe, href: '/explore-map', label: 'Atlas' },
                { icon: Share2, href: '#', label: 'Share' },
                { icon: Compass, href: '/explore-map', label: 'Explore' },
                { icon: Mail, href: 'mailto:curious@travelmind.ai', label: 'Contact' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-xl bg-[#0B1424] hover:bg-[#101D32] border border-white/5 text-[#9BA9BD] hover:text-[#42E8D8] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Categories */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#42E8D8]">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link: any) => (
                  <li key={link.label}>
                    {link.isModal ? (
                      <button
                        type="button"
                        onClick={() => setShowAttributionModal(true)}
                        className="text-xs text-[#9BA9BD] hover:text-[#42E8D8] text-left transition-colors flex items-center gap-1"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="text-xs text-[#9BA9BD] hover:text-[#F5F7FB] transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9BA9BD]">
          <p>© {new Date().getFullYear()} TRAVELMIND AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowAttributionModal(true)}
              className="text-[11px] text-[#42E8D8] hover:underline"
            >
              Open Data Licensing (GeoNames CC BY 4.0 & OSM ODbL)
            </button>
            <p className="flex items-center gap-1 text-[11px]">
              Engineered with <Heart className="w-3.5 h-3.5 text-[#FFB86B] fill-[#FFB86B]" /> for world travelers
            </p>
          </div>
        </div>
      </div>

      {/* Attribution Modal */}
      <DataAttributionModal
        isOpen={showAttributionModal}
        onClose={() => setShowAttributionModal(false)}
      />
    </footer>
  )
}
