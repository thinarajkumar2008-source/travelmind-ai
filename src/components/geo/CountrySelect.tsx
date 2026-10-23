import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Country, geoService } from '../../services/geoService'
import { Globe, Search, ChevronDown, Check, X } from 'lucide-react'

interface CountrySelectProps {
  selectedCountry?: Country | null
  onSelect: (country: Country) => void
  placeholder?: string
  className?: string
}

const CONTINENTS = [
  'All',
  'Asia',
  'Europe',
  'Africa',
  'North America',
  'South America',
  'Oceania',
]

export default function CountrySelect({
  selectedCountry,
  onSelect,
  placeholder = 'Select a Country (100+ Worldwide)',
  className = '',
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedContinent, setSelectedContinent] = useState('All')
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let isMounted = true
    const loadCountries = async () => {
      setLoading(true)
      try {
        const data = await geoService.getCountries()
        if (isMounted) setCountries(data)
      } catch (err) {
        console.error('Failed to load countries:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadCountries()
    return () => {
      isMounted = false
    }
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const filteredCountries = useMemo(() => {
    return countries.filter(c => {
      const matchContinent =
        selectedContinent === 'All' ||
        c.continent.toLowerCase() === selectedContinent.toLowerCase() ||
        (selectedContinent === 'Americas' && (c.continent === 'North America' || c.continent === 'South America'))

      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q) ||
        c.iso3.toLowerCase().includes(q) ||
        (c.capital && c.capital.toLowerCase().includes(q))

      return matchContinent && matchSearch
    })
  }, [countries, selectedContinent, search])

  const handleSelectCountry = (country: Country) => {
    onSelect(country)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl bg-navy-900/90 border border-navy-700/80 hover:border-teal-500/50 text-white text-sm transition-all shadow-md backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-500/30"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Globe className="w-4 h-4 text-teal-400 shrink-0" />
          {selectedCountry ? (
            <span className="flex items-center gap-2 truncate font-medium">
              <span className="text-base">{selectedCountry.flag_emoji || '🌐'}</span>
              <span className="text-white truncate">{selectedCountry.name}</span>
              <span className="text-xs text-navy-400 font-mono">({selectedCountry.iso2})</span>
            </span>
          ) : (
            <span className="text-navy-400 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-navy-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-teal-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[320px] max-w-md sm:max-w-lg left-0 bg-navy-900/95 border border-navy-700 rounded-2xl shadow-2xl backdrop-blur-xl p-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input */}
          <div className="relative mb-2.5">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by country or capital..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-navy-950/80 border border-navy-700 text-white text-xs placeholder:text-navy-500 focus:outline-none focus:border-teal-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Continent Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none border-b border-navy-800">
            {CONTINENTS.map(continent => (
              <button
                key={continent}
                type="button"
                onClick={() => setSelectedContinent(continent)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedContinent === continent
                    ? 'bg-teal-500 text-white font-medium shadow-sm'
                    : 'bg-navy-800/60 text-navy-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>

          {/* Countries List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {loading ? (
              <div className="py-8 text-center text-xs text-navy-400">Loading countries...</div>
            ) : filteredCountries.length === 0 ? (
              <div className="py-8 text-center text-xs text-navy-400">No countries found</div>
            ) : (
              filteredCountries.map(country => {
                const isSelected = selectedCountry?.id === country.id
                return (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'text-navy-200 hover:bg-navy-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg leading-none shrink-0">{country.flag_emoji || '🌐'}</span>
                      <div className="truncate">
                        <div className="font-medium text-white truncate">{country.name}</div>
                        <div className="text-[10px] text-navy-400 truncate">
                          {country.capital ? `${country.capital} • ` : ''}
                          {country.continent}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-navy-400 bg-navy-950/60 px-1.5 py-0.5 rounded border border-navy-800">
                        {country.iso2}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Footer count */}
          <div className="mt-2 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-navy-400 px-1">
            <span>{filteredCountries.length} countries found</span>
            <span className="text-teal-400/80 font-mono">100% Free Data</span>
          </div>
        </div>
      )}
    </div>
  )
}
