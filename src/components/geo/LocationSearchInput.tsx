import React, { useState, useEffect, useRef } from 'react'
import { GeoLocation, geoService } from '../../services/geoService'
import { Search, MapPin, Building2, Trees, Landmark, Loader2, X, Compass } from 'lucide-react'

interface LocationSearchInputProps {
  countryId?: string
  placeholder?: string
  onSelect: (location: GeoLocation) => void
  className?: string
  autoFocus?: boolean
}

export default function LocationSearchInput({
  countryId,
  placeholder = 'Search cities, towns, villages, or settlements worldwide...',
  onSelect,
  className = '',
  autoFocus = false,
}: LocationSearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchedWithFallback, setSearchedWithFallback] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      setLoading(false)
      return
    }

    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await geoService.searchLocations(query.trim(), {
          countryCode: countryId,
          limit: 12,
        })

        if (res.results && res.results.length > 0) {
          setResults(res.results)
          setIsOpen(true)
          setSearchedWithFallback(false)
        } else {
          // If no results in local database, use free OpenStreetMap Nominatim
          setSearchedWithFallback(true)
          const osmResults = await searchNominatimFallback(query.trim())
          setResults(osmResults)
          setIsOpen(osmResults.length > 0)
        }
      } catch (err) {
        console.error('Search locations error:', err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, countryId])

  // Fallback to OSM Nominatim
  const searchNominatimFallback = async (q: string): Promise<GeoLocation[]> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&limit=5&addressdetails=1`
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
      })
      if (!res.ok) return []
      const data = await res.json()
      return data.map((item: any) => {
        let type: 'city' | 'town' | 'village' | 'settlement' = 'settlement'
        if (item.type === 'city' || item.addresstype === 'city') type = 'city'
        else if (item.type === 'town' || item.addresstype === 'town') type = 'town'
        else if (item.type === 'village' || item.addresstype === 'village') type = 'village'

        const addr = item.address || {}
        const regionName = addr.state || addr.region || addr.province || ''
        const countryName = addr.country || ''

        return {
          id: `osm-${item.place_id}`,
          country_id: (addr.country_code || '').toUpperCase(),
          country_name: countryName,
          region_name: regionName,
          name: item.name || q,
          location_type: type,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          data_source: 'OpenStreetMap (ODbL)',
          external_source_id: String(item.place_id),
        }
      })
    } catch {
      return []
    }
  }

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSelect = (loc: GeoLocation) => {
    setQuery(loc.name)
    setIsOpen(false)
    onSelect(loc)
  }

  const clearQuery = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'city':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Building2 className="w-2.5 h-2.5" /> City
          </span>
        )
      case 'town':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Landmark className="w-2.5 h-2.5" /> Town
          </span>
        )
      case 'village':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Trees className="w-2.5 h-2.5" /> Village
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <MapPin className="w-2.5 h-2.5" /> Settlement
          </span>
        )
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-900/90 border border-navy-700/80 hover:border-teal-500/50 text-white text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 shadow-md backdrop-blur-md transition-all"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {loading && <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />}
          {query && !loading && (
            <button
              type="button"
              onClick={clearQuery}
              className="text-navy-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-navy-900/95 border border-navy-700 rounded-2xl shadow-2xl backdrop-blur-xl p-2 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-medium text-navy-400 px-3 py-1 flex items-center justify-between border-b border-navy-800/80 mb-1">
            <span>
              {searchedWithFallback ? 'Live OpenStreetMap Results' : 'Global Locations Database'}
            </span>
            <span className="font-mono text-teal-400/80">{results.length} matches</span>
          </div>

          <div className="space-y-0.5">
            {results.map((loc, idx) => {
              const isSelected = selectedIndex === idx
              return (
                <button
                  key={`${loc.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-navy-200 hover:bg-navy-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{loc.flag_emoji || '📍'}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-medium text-white truncate">{loc.name}</span>
                        {getTypeBadge(loc.location_type)}
                      </div>
                      <div className="text-[10px] text-navy-400 truncate flex items-center gap-1.5 mt-0.5">
                        {loc.region_name && <span>{loc.region_name}, </span>}
                        <span>{loc.country_name || loc.country_id}</span>
                        {loc.population ? (
                          <span className="font-mono text-navy-500">
                            • pop: {loc.population.toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <div className="hidden sm:block text-[10px] font-mono text-navy-500">
                      {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                    </div>
                    <Compass className="w-3.5 h-3.5 text-teal-400/70" />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-navy-800/80 px-2 flex items-center justify-between text-[10px] text-navy-400">
            <span>↑↓ to navigate • Enter to select</span>
            <span className="text-navy-500">Free Geo Data (GeoNames + OSM)</span>
          </div>
        </div>
      )}
    </div>
  )
}
