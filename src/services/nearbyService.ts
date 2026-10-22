import { NearbyDestination } from '../types'
import { POPULAR_DESTINATIONS, DestinationItem } from '../lib/constants'

// Reference coordinates for major traveler origin cities
const CITY_COORDINATES: Record<string, { lat: number; lng: number; displayName: string }> = {
  // Kerala
  kochi: { lat: 9.9312, lng: 76.2673, displayName: 'Kochi, Kerala' },
  cochin: { lat: 9.9312, lng: 76.2673, displayName: 'Kochi, Kerala' },
  ernakulam: { lat: 9.9816, lng: 76.2999, displayName: 'Ernakulam, Kerala' },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, displayName: 'Thiruvananthapuram, Kerala' },
  trivandrum: { lat: 8.5241, lng: 76.9366, displayName: 'Thiruvananthapuram, Kerala' },
  kozhikode: { lat: 11.2588, lng: 75.7804, displayName: 'Kozhikode, Kerala' },
  calicut: { lat: 11.2588, lng: 75.7804, displayName: 'Kozhikode, Kerala' },
  thrissur: { lat: 10.5276, lng: 76.2144, displayName: 'Thrissur, Kerala' },
  kollam: { lat: 8.8932, lng: 76.6141, displayName: 'Kollam, Kerala' },
  kottayam: { lat: 9.5916, lng: 76.5222, displayName: 'Kottayam, Kerala' },
  alappuzha: { lat: 9.4981, lng: 76.3388, displayName: 'Alappuzha, Kerala' },
  alleppey: { lat: 9.4981, lng: 76.3388, displayName: 'Alappuzha, Kerala' },
  palakkad: { lat: 10.7867, lng: 76.6548, displayName: 'Palakkad, Kerala' },
  kannur: { lat: 11.8745, lng: 75.3704, displayName: 'Kannur, Kerala' },

  // Tamil Nadu
  chennai: { lat: 13.0827, lng: 80.2707, displayName: 'Chennai, Tamil Nadu' },
  coimbatore: { lat: 11.0168, lng: 76.9558, displayName: 'Coimbatore, Tamil Nadu' },
  madurai: { lat: 9.9252, lng: 78.1198, displayName: 'Madurai, Tamil Nadu' },
  salem: { lat: 11.6643, lng: 78.1460, displayName: 'Salem, Tamil Nadu' },
  trichy: { lat: 10.7905, lng: 78.7047, displayName: 'Tiruchirappalli, Tamil Nadu' },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047, displayName: 'Tiruchirappalli, Tamil Nadu' },

  // Karnataka
  bengaluru: { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' },
  bangalore: { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' },
  mysore: { lat: 12.2958, lng: 76.6394, displayName: 'Mysore, Karnataka' },
  mysuru: { lat: 12.2958, lng: 76.6394, displayName: 'Mysore, Karnataka' },
  mangalore: { lat: 12.9141, lng: 74.8560, displayName: 'Mangalore, Karnataka' },
  mangaluru: { lat: 12.9141, lng: 74.8560, displayName: 'Mangalore, Karnataka' },
  hubli: { lat: 15.3647, lng: 75.1240, displayName: 'Hubli, Karnataka' },

  // Maharashtra
  mumbai: { lat: 19.0760, lng: 72.8777, displayName: 'Mumbai, Maharashtra' },
  bombay: { lat: 19.0760, lng: 72.8777, displayName: 'Mumbai, Maharashtra' },
  pune: { lat: 18.5204, lng: 73.8567, displayName: 'Pune, Maharashtra' },
  nagpur: { lat: 21.1458, lng: 79.0882, displayName: 'Nagpur, Maharashtra' },
  nashik: { lat: 19.9975, lng: 73.7898, displayName: 'Nashik, Maharashtra' },

  // North India
  delhi: { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi' },
  'new delhi': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi' },
  noida: { lat: 28.5355, lng: 77.3910, displayName: 'Noida, Uttar Pradesh' },
  gurgaon: { lat: 28.4595, lng: 77.0266, displayName: 'Gurugram, Haryana' },
  gurugram: { lat: 28.4595, lng: 77.0266, displayName: 'Gurugram, Haryana' },
  jaipur: { lat: 26.9124, lng: 75.7873, displayName: 'Jaipur, Rajasthan' },
  lucknow: { lat: 26.8467, lng: 80.9462, displayName: 'Lucknow, Uttar Pradesh' },
  chandigarh: { lat: 30.7333, lng: 76.7794, displayName: 'Chandigarh' },
  dehradun: { lat: 30.3165, lng: 78.0322, displayName: 'Dehradun, Uttarakhand' },

  // East & Central
  kolkata: { lat: 22.5726, lng: 88.3639, displayName: 'Kolkata, West Bengal' },
  calcutta: { lat: 22.5726, lng: 88.3639, displayName: 'Kolkata, West Bengal' },
  hyderabad: { lat: 17.3850, lng: 78.4867, displayName: 'Hyderabad, Telangana' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, displayName: 'Ahmedabad, Gujarat' },
  surat: { lat: 21.1702, lng: 72.8311, displayName: 'Surat, Gujarat' },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, displayName: 'Visakhapatnam, Andhra Pradesh' },
  vizag: { lat: 17.6868, lng: 83.2185, displayName: 'Visakhapatnam, Andhra Pradesh' },

  // International hubs
  dubai: { lat: 25.2048, lng: 55.2708, displayName: 'Dubai, UAE' },
  singapore: { lat: 1.3521, lng: 103.8198, displayName: 'Singapore' },
  london: { lat: 51.5074, lng: -0.1278, displayName: 'London, UK' },
  'new york': { lat: 40.7128, lng: -74.0060, displayName: 'New York, USA' },
  tokyo: { lat: 35.6762, lng: 139.6503, displayName: 'Tokyo, Japan' },
  bangkok: { lat: 13.7563, lng: 100.5018, displayName: 'Bangkok, Thailand' },
}

// Additional rich nearby destinations pool
const EXTENDED_DESTINATIONS: DestinationItem[] = [
  ...POPULAR_DESTINATIONS,
  {
    id: 'alleppey',
    name: 'Alleppey (Alappuzha)',
    location: 'Kerala, India',
    country: 'India',
    latitude: 9.4981,
    longitude: 76.3388,
    description: 'The Venice of the East with tranquil backwaters, traditional houseboats, and coir canals.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
    rating: 4.8,
    category: 'Coastal',
    highlights: ['Vembanad Lake Houseboats', 'Marari Beach', 'Punnamada Lake', 'Alappuzha Lighthouse'],
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    location: 'Kerala, India',
    country: 'India',
    latitude: 11.6854,
    longitude: 76.1320,
    description: 'Misty Western Ghats highlands, prehistoric Edakkal caves, and spice plantations.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    rating: 4.7,
    category: 'Nature',
    highlights: ['Banasura Sagar Dam', 'Edakkal Caves', 'Chembra Peak Heart Lake', 'Soochipara Falls'],
  },
  {
    id: 'thekkady',
    name: 'Thekkady & Periyar',
    location: 'Kerala, India',
    country: 'India',
    latitude: 9.6031,
    longitude: 77.1615,
    description: 'Periyar National Park wildlife sanctuary, spice walks, and jungle bamboo rafting.',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80',
    rating: 4.6,
    category: 'Nature',
    highlights: ['Periyar Wildlife Boat Safari', 'Spice Gardens Walk', 'Bamboo Rafting', 'Elephant Sanctuary'],
  },
  {
    id: 'coorg',
    name: 'Coorg (Madikeri)',
    location: 'Karnataka, India',
    country: 'India',
    latitude: 12.4244,
    longitude: 75.7382,
    description: 'The Scotland of India, blanketed in aromatic coffee estates, misty peaks, and Abbey Falls.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    rating: 4.7,
    category: 'Hill Station',
    highlights: ['Abbey Falls', 'Raja Seat Sunset View', 'Namdroling Golden Monastery', 'Coffee Plantation Walk'],
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry (Puducherry)',
    location: 'Tamil Nadu Coast, India',
    country: 'India',
    latitude: 11.9416,
    longitude: 79.8083,
    description: 'French colonial quarter with bright bougainvillea, Promenade beach, and peaceful Auroville.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    rating: 4.7,
    category: 'Beach',
    highlights: ['White Town French Quarter', 'Promenade Beach Walk', 'Auroville Matrimandir', 'Paradise Beach'],
  },
  {
    id: 'kodaikanal',
    name: 'Kodaikanal',
    location: 'Tamil Nadu, India',
    country: 'India',
    latitude: 10.2381,
    longitude: 77.4892,
    description: 'The Princess of Hill Stations featuring star-shaped Kodai lake, pine forests, and Pillar Rocks.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
    rating: 4.6,
    category: 'Hill Station',
    highlights: ['Kodaikanal Star Lake', 'Pillar Rocks', 'Coaker Walk', 'Pine Forest Trail'],
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh & Haridwar',
    location: 'Uttarakhand, India',
    country: 'India',
    latitude: 30.0869,
    longitude: 78.2676,
    description: 'Yoga capital of the world on the holy Ganges with white water rafting and Himalayan foothill views.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    rating: 4.8,
    category: 'Culture',
    highlights: ['Laxman Jhula', 'Ganga Aarti at Triveni Ghat', 'White Water Rafting', 'Beatles Ashram'],
  },
  {
    id: 'agra',
    name: 'Agra & Taj Mahal',
    location: 'Uttar Pradesh, India',
    country: 'India',
    latitude: 27.1767,
    longitude: 78.0081,
    description: 'Home of the timeless white marble Taj Mahal, Agra Fort, and Mughal architectural grandeur.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    rating: 4.9,
    category: 'Heritage',
    highlights: ['Taj Mahal Sunrise', 'Agra Fort Citadel', 'Mehtab Bagh Sunset', 'Fatehpur Sikri'],
  },
  {
    id: 'lonavala',
    name: 'Lonavala & Khandala',
    location: 'Maharashtra, India',
    country: 'India',
    latitude: 18.7557,
    longitude: 73.4091,
    description: 'Verdant Sahyadri mountain retreats with cascading monsoon waterfalls and historic Karla Caves.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.5,
    category: 'Hill Station',
    highlights: ['Tiger Leap Viewpoint', 'Bhushi Dam', 'Karla Buddhist Caves', 'Lonavala Chikki Trail'],
  },
]

// Haversine formula distance in kilometers
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

// Convert driving distance to estimated travel time string
function formatTravelTime(distanceKm: number): string {
  if (distanceKm <= 50) return '~1 hour drive'
  if (distanceKm <= 100) return `~${Math.round(distanceKm / 45)} hrs drive`
  if (distanceKm <= 300) return `~${(distanceKm / 55).toFixed(1)} hrs road trip`
  if (distanceKm <= 600) return `~${(distanceKm / 65).toFixed(0)} hrs drive / train`
  return `~${(distanceKm / 75).toFixed(0)} hrs (or short flight)`
}

// Resolve user input place name to coordinates
export function resolvePlaceCoordinates(rawPlace: string): {
  lat: number
  lng: number
  resolvedName: string
} {
  const cleaned = rawPlace.trim().toLowerCase()
  if (!cleaned) {
    // Default origin: Kochi, Kerala
    return { lat: 9.9312, lng: 76.2673, resolvedName: 'Kochi, Kerala' }
  }

  // Exact or partial match in city directory
  for (const [key, val] of Object.entries(CITY_COORDINATES)) {
    if (cleaned === key || cleaned.includes(key) || key.includes(cleaned)) {
      return { lat: val.lat, lng: val.lng, resolvedName: val.displayName }
    }
  }

  // Fallback defaults based on keyword hints
  if (cleaned.includes('kerala')) {
    return { lat: 9.9312, lng: 76.2673, resolvedName: `${rawPlace} (Kerala)` }
  }
  if (cleaned.includes('tamil') || cleaned.includes('chennai')) {
    return { lat: 13.0827, lng: 80.2707, resolvedName: `${rawPlace} (Tamil Nadu)` }
  }
  if (cleaned.includes('karnataka') || cleaned.includes('bangalore')) {
    return { lat: 12.9716, lng: 77.5946, resolvedName: `${rawPlace} (Karnataka)` }
  }
  if (cleaned.includes('maharashtra') || cleaned.includes('mumbai')) {
    return { lat: 19.0760, lng: 72.8777, resolvedName: `${rawPlace} (Maharashtra)` }
  }
  if (cleaned.includes('delhi')) {
    return { lat: 28.6139, lng: 77.2090, displayName: 'Delhi NCR' } as any
  }

  // Default coordinate center
  return { lat: 10.8505, lng: 76.2711, resolvedName: rawPlace }
}

/**
 * Returns sorted nearby travel destinations based on user's entered place/city.
 * Computes exact km distance and road travel times.
 */
export function getNearbyDestinationsForPlace(
  userPlace: string,
  limit = 6
): {
  resolvedLocation: string
  destinations: NearbyDestination[]
} {
  const { lat, lng, resolvedName } = resolvePlaceCoordinates(userPlace)

  const mapped: NearbyDestination[] = EXTENDED_DESTINATIONS.map((dest) => {
    const distanceKm = calculateHaversineDistance(
      lat,
      lng,
      dest.latitude,
      dest.longitude
    )
    return {
      id: dest.id,
      name: dest.name,
      stateOrRegion: dest.location,
      country: dest.country,
      distanceKm,
      travelTime: formatTravelTime(distanceKm),
      category: dest.category,
      rating: dest.rating,
      image: dest.image,
      description: dest.description,
      highlights: dest.highlights || [],
      coordinates: {
        lat: dest.latitude,
        lng: dest.longitude,
      },
    }
  })

  // Sort by closest distance to user place first
  mapped.sort((a, b) => a.distanceKm - b.distanceKm)

  return {
    resolvedLocation: resolvedName,
    destinations: mapped.slice(0, limit),
  }
}
