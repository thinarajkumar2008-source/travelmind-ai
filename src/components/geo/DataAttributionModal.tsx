import React, { useState, useEffect } from 'react'
import { X, ExternalLink, ShieldCheck, Database, Globe2, Heart, Award } from 'lucide-react'
import { geoService, GeoStats } from '../../services/geoService'

interface DataAttributionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DataAttributionModal({ isOpen, onClose }: DataAttributionModalProps) {
  const [stats, setStats] = useState<GeoStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    const loadStats = async () => {
      setLoading(true)
      try {
        const data = await geoService.getGeoStats()
        if (isMounted) setStats(data)
      } catch (err) {
        console.error('Failed to load geo stats:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadStats()
    return () => {
      isMounted = false
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-navy-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-navy-800 text-navy-400 hover:text-white hover:bg-navy-700 transition-colors"
          aria-label="Close attribution modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Open Geographic Data & Attribution
            </h2>
            <p className="text-xs sm:text-sm text-navy-400 mt-0.5">
              100% Free & Open-Source Global Travel Intelligence
            </p>
          </div>
        </div>

        {/* Live Database Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800 text-center">
            <div className="text-xl sm:text-2xl font-bold text-teal-400">
              {stats ? stats.total_countries : '126'}
            </div>
            <div className="text-[11px] text-navy-400 mt-1 uppercase tracking-wider font-semibold">
              Countries
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800 text-center">
            <div className="text-xl sm:text-2xl font-bold text-teal-300">
              {stats ? stats.total_administrative_regions : '40+'}
            </div>
            <div className="text-[11px] text-navy-400 mt-1 uppercase tracking-wider font-semibold">
              States / Regions
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800 text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-400">
              {stats ? stats.total_locations : '150+'}
            </div>
            <div className="text-[11px] text-navy-400 mt-1 uppercase tracking-wider font-semibold">
              Places & Cities
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800 text-center">
            <div className="text-xl sm:text-2xl font-bold text-emerald-400">
              {stats ? stats.total_villages : '35+'}
            </div>
            <div className="text-[11px] text-navy-400 mt-1 uppercase tracking-wider font-semibold">
              Towns & Villages
            </div>
          </div>
        </div>

        {/* Data Sources and Licensing */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-navy-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-teal-400" /> Primary Data Sources
          </h3>

          {/* GeoNames */}
          <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800/80 hover:border-navy-700 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span>GeoNames Geographical Database</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    CC BY 4.0
                  </span>
                </div>
                <p className="text-xs text-navy-300 mt-1.5 leading-relaxed">
                  Geographic names, coordinates, administrative hierarchies, populations, and settlement classifications are provided under the Creative Commons Attribution 4.0 International License.
                </p>
              </div>
              <a
                href="https://www.geonames.org"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-navy-800 text-navy-400 hover:text-teal-400 shrink-0 transition-colors"
                title="Visit GeoNames"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* OpenStreetMap */}
          <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800/80 hover:border-navy-700 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span>OpenStreetMap & Leaflet</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    ODbL
                  </span>
                </div>
                <p className="text-xs text-navy-300 mt-1.5 leading-relaxed">
                  Map cartography, tiles, and reverse geocoding are powered by © OpenStreetMap contributors under the Open Database License (ODbL). Map rendering uses the open-source Leaflet library.
                </p>
              </div>
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-navy-800 text-navy-400 hover:text-teal-400 shrink-0 transition-colors"
                title="OpenStreetMap Copyright"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* REST Countries */}
          <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800/80 hover:border-navy-700 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span>REST Countries API</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    MPL 2.0 / Public Domain
                  </span>
                </div>
                <p className="text-xs text-navy-300 mt-1.5 leading-relaxed">
                  Country metadata including ISO codes, capital cities, currencies, official languages, and flags are gathered from the open-source REST Countries project.
                </p>
              </div>
              <a
                href="https://restcountries.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-navy-800 text-navy-400 hover:text-teal-400 shrink-0 transition-colors"
                title="REST Countries"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Zero-Cost Commitment */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-navy-950/60 to-teal-950/40 border border-teal-500/20 mb-6 flex items-start gap-3">
          <Award className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold text-white">Strict ₹0 Zero-Cost Architecture: </span>
            <span className="text-navy-300">
              TRAVELMIND AI uses exclusively free and open data. No commercial map subscriptions, paid geocoding APIs, or proprietary place APIs are ever required.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <div className="flex items-center gap-1.5 text-xs text-navy-400">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Built with open knowledge for world travelers</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-lg shadow-teal-500/20 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
