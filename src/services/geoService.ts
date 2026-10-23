import { COUNTRIES_SEED } from './countriesData'

export interface Country {
  id: string
  name: string
  iso2: string
  iso3: string
  capital?: string
  continent: string
  region?: string
  currency_code?: string
  languages?: string
  flag_emoji?: string
  latitude?: number
  longitude?: number
}

export interface AdministrativeRegion {
  id: string
  country_id: string
  name: string
  region_code?: string
  region_type: string
}

export interface GeoLocation {
  id: string
  country_id: string
  country_name?: string
  flag_emoji?: string
  administrative_region_id?: string
  region_name?: string
  name: string
  location_type: 'city' | 'town' | 'village' | 'settlement'
  latitude: number
  longitude: number
  population?: number
  timezone?: string
  data_source: string
  external_source_id?: string
  distance_km?: number
}

export interface LocationSearchResponse {
  query: string
  total: number
  page: number
  limit: number
  results: GeoLocation[]
}

export interface GeoStats {
  total_countries: number
  total_administrative_regions: number
  total_locations: number
  total_villages: number
  total_travel_destinations: number
  continent_breakdown: Record<string, number>
  sources: {
    name: string
    license: string
    url: string
  }[]
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export const geoService = {
  // In-memory country cache
  _cachedCountries: null as Country[] | null,

  async getCountries(continent?: string, query?: string): Promise<Country[]> {
    // Fast path: try fetching from backend
    try {
      const url = new URL(`${BACKEND_URL}/api/countries`)
      if (continent && continent !== 'All') url.searchParams.append('continent', continent)
      if (query) url.searchParams.append('q', query)

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(3000) })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          return data
        }
      }
    } catch {
      // Fallback to local high-speed dataset
    }

    // Local cached fallback (120+ countries)
    let list: Country[] = COUNTRIES_SEED
    if (continent && continent !== 'All') {
      list = list.filter(c => c.continent.toLowerCase() === continent.toLowerCase())
    }
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.iso2.toLowerCase() === q || 
        c.iso3.toLowerCase() === q ||
        (c.capital && c.capital.toLowerCase().includes(q))
      )
    }
    return list
  },

  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/countries/${code}`, { signal: AbortSignal.timeout(2500) })
      if (res.ok) return await res.json()
    } catch {
      // ignore
    }
    const clean = code.trim().toLowerCase()
    return COUNTRIES_SEED.find(c => 
      c.iso2.toLowerCase() === clean || 
      c.iso3.toLowerCase() === clean || 
      c.id.toLowerCase() === clean
    ) || null
  },

  async getCountryRegions(countryCode: string): Promise<AdministrativeRegion[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/countries/${countryCode}/regions`, { signal: AbortSignal.timeout(3000) })
      if (res.ok) return await res.json()
    } catch {
      // ignore
    }
    return []
  },

  async searchLocations(
    query: string,
    options: {
      countryCode?: string
      regionId?: string
      type?: string
      limit?: number
      offset?: number
    } = {}
  ): Promise<LocationSearchResponse> {
    const limit = options.limit || 15
    const offset = options.offset || 0

    try {
      const url = new URL(`${BACKEND_URL}/api/locations/search`)
      url.searchParams.append('q', query)
      if (options.countryCode) url.searchParams.append('country_code', options.countryCode)
      if (options.regionId) url.searchParams.append('region_id', options.regionId)
      if (options.type) url.searchParams.append('type', options.type)
      url.searchParams.append('limit', limit.toString())
      url.searchParams.append('offset', offset.toString())

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(3000) })
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // Fallback matching
    }

    // Client-side quick fallback
    return {
      query,
      total: 0,
      page: 1,
      limit,
      results: []
    }
  },

  async getNearbyLocations(
    lat: number,
    lon: number,
    radiusKm: number = 100,
    limit: number = 10,
    type?: string
  ): Promise<GeoLocation[]> {
    try {
      const url = new URL(`${BACKEND_URL}/api/locations/nearby`)
      url.searchParams.append('lat', lat.toString())
      url.searchParams.append('lon', lon.toString())
      url.searchParams.append('radius_km', radiusKm.toString())
      url.searchParams.append('limit', limit.toString())
      if (type) url.searchParams.append('type', type)

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(3000) })
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // ignore
    }
    return []
  },

  async getGeoStats(): Promise<GeoStats> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/geo/stats`, { signal: AbortSignal.timeout(3000) })
      if (res.ok) return await res.json()
    } catch {
      // ignore
    }
    return {
      total_countries: 126,
      total_administrative_regions: 41,
      total_locations: 46,
      total_villages: 12,
      total_travel_destinations: 8,
      continent_breakdown: {
        Asia: 30,
        Europe: 35,
        Africa: 24,
        'North America': 15,
        'South America': 12,
        Oceania: 10,
      },
      sources: [
        {
          name: 'GeoNames',
          license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
          url: 'https://www.geonames.org/',
        },
        {
          name: 'OpenStreetMap',
          license: 'Open Data Commons Open Database License (ODbL)',
          url: 'https://www.openstreetmap.org/copyright',
        },
        {
          name: 'REST Countries',
          license: 'Mozilla Public License 2.0 (MPL 2.0)',
          url: 'https://restcountries.com/',
        },
      ],
    }
  },
}
