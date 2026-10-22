import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Globe, Share2, Mail, ShieldCheck, Heart } from 'lucide-react'
import { SITE_NAME } from '../../lib/constants'

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
    { label: 'Leaflet OpenStreetMap', href: 'https://www.openstreetmap.org' },
    { label: 'Open Geocoding Policy', href: 'https://nominatim.openstreetmap.org' },
    { label: 'Privacy & Terms', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#070B14] text-[#F5F7FB] border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 carto-grid opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 group-hover:border-[#42E8D8]/50 transition-colors">
                <Compass className="w-5 h-5 text-[#42E8D8]" />
              </div>
              <span className="text-xl font-black tracking-wider text-[#F5F7FB] font-display">
                TRAVELMIND <span className="text-[#42E8D8]">AI</span>
              </span>
            </Link>

            <p className="text-[#9BA9BD] text-xs sm:text-sm leading-relaxed max-w-sm">
              Cinematic intelligence for curious travelers. Transforming travel videos into comprehensive destination guides, interactive atlases, and actionable itineraries.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1424] border border-[#42E8D8]/20 text-[#42E8D8] text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free & Open Source (₹0)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              {[
                { icon: Globe, href: '#', label: 'Atlas' },
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
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-[#9BA9BD] hover:text-[#F5F7FB] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9BA9BD]">
          <p>© {new Date().getFullYear()} TRAVELMIND AI. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Engineered with <Heart className="w-3.5 h-3.5 text-[#FFB86B] fill-[#FFB86B]" /> for world travelers
          </p>
        </div>
      </div>
    </footer>
  )
}
