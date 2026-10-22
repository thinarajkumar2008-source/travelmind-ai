export interface User {
  id: string
  email: string
  fullName?: string
  phone?: string
  place?: string
  avatarUrl?: string
  createdAt?: string
  authProvider?: 'email' | 'phone' | 'google'
}

export interface NearbyDestination {
  id: string
  name: string
  stateOrRegion: string
  country: string
  distanceKm: number
  travelTime: string
  category: string
  rating: number
  image: string
  description: string
  highlights: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

export interface UserPreferences {
  categories: string[]
  travelPace: 'relaxed' | 'moderate' | 'fast-paced'
  accommodationPreference: 'budget' | 'boutique' | 'luxury' | 'resort'
  foodPreference: string[]
  preferredCurrency: string
  accessibilityNeeds?: string
  theme: 'light' | 'dark' | 'system'
}

export type JobStatus = 'uploading' | 'processing' | 'analyzing' | 'completed' | 'failed'

export interface DestinationCandidate {
  id: string
  name: string
  stateOrRegion: string
  country: string
  confidence: number // 0 to 100
  confidenceLevel: 'High' | 'Medium' | 'Low'
  summary: string
  detectedLandmarks: string[]
  visualClues: string[]
  textOrSignsDetected: string[]
  audioEvidence?: string
  imageUrl: string
  coordinates: {
    lat: number
    lng: number
  }
  isConfirmed?: boolean
}

export interface VideoAnalysisJob {
  id: string
  videoUrl?: string
  videoFileName: string
  videoFileSize: string
  videoDurationSeconds?: number
  thumbnailUrl: string
  status: JobStatus
  progress: number
  statusMessage: string
  createdAt: string
  completedAt?: string
  errorMessage?: string
  candidates: DestinationCandidate[]
  confirmedDestinationId?: string
  analysisDetails: {
    framesAnalyzed: number
    landmarksCount: number
    speechDetected: boolean
    sceneryTypes: string[]
  }
}

export interface TravelGuide {
  id: string
  name: string
  stateOrRegion: string
  country: string
  tagline: string
  coverImage: string
  galleryImages: string[]
  confidenceScore: number
  coordinates: {
    lat: number
    lng: number
  }
  overview: {
    description: string
    geography: string
    history: string
    culturalSignificance: string
    famousLandmarks: string[]
    localCustoms: string[]
  }
  bestTimeToVisit: {
    peakSeason: string
    shoulderSeason: string
    monsoonOrOffSeason: string
    weatherSummary: string
    monthlyTemperatures: { month: string; tempC: number; rainfallMm: number }[]
    clothingAdvice: string
  }
  visitorInfo: {
    entryFees: string
    timings: string
    nearestAirport: string
    nearestRailway: string
    localTransport: string[]
    accessibilityNotes: string
    safetyTips: string[]
  }
  thingsToDo: {
    id: string
    title: string
    category: 'Nature' | 'Adventure' | 'Culture' | 'Relaxation' | 'Photography'
    description: string
    duration: string
    suitableFor: string
  }[]
  foodAndCulture: {
    specialties: { name: string; description: string; isVeg: boolean }[]
    diningTips: string[]
    etiquette: string[]
  }
  hotelsCount: number
  restaurantsCount: number
  attractionsCount: number
}

export interface Hotel {
  id: string
  destinationId: string
  name: string
  category: 'Resort' | 'Luxury' | 'Boutique' | 'Homestay' | 'Budget'
  address: string
  distanceKm: number
  rating: number
  reviewsCount: number
  pricePerNight: number
  currency: string
  hasVerifiedPrice: boolean
  priceLevel?: string
  amenities: string[]
  imageUrl: string
  bookingUrl: string
  phone?: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Restaurant {
  id: string
  destinationId: string
  name: string
  cuisine: string[]
  isVegetarianFriendly: boolean
  isPureVeg?: boolean
  rating: number
  reviewsCount: number
  priceLevel: '$' | '$$' | '$$$' | '$$$$'
  approxMealForTwo: number
  currency: string
  address: string
  distanceKm: number
  isOpenNow: boolean
  openingHours: string
  specialties: string[]
  imageUrl: string
  contactPhone?: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Attraction {
  id: string
  destinationId: string
  name: string
  category: 'Viewpoint' | 'Waterfall' | 'National Park' | 'Heritage' | 'Adventure' | 'Garden'
  description: string
  distanceKm: number
  travelTimeMinutes: number
  entryFee: string
  openingHours: string
  rating: number
  reviewsCount: number
  imageUrl: string
  isFamilyFriendly: boolean
  coordinates: {
    lat: number
    lng: number
  }
}

export interface ItineraryDay {
  dayNumber: number
  title: string
  theme: string
  morningActivity: string
  morningPlace: string
  afternoonActivity: string
  afternoonPlace: string
  eveningActivity: string
  eveningPlace: string
  recommendedRestaurant: string
  estimatedDailyExpense: number
  travelTips: string
}

export interface Itinerary {
  id: string
  userId?: string
  destinationId: string
  destinationName: string
  title: string
  startDate: string
  endDate: string
  durationDays: number
  travelersCount: number
  budgetCategory: 'budget' | 'moderate' | 'luxury'
  pace: 'relaxed' | 'moderate' | 'packed'
  days: ItineraryDay[]
  totalEstimatedCost: number
  currency: string
  createdAt: string
}

export interface BudgetEstimate {
  destinationId: string
  destinationName: string
  durationDays: number
  travelersCount: number
  currency: string
  tier: 'budget' | 'moderate' | 'luxury'
  breakdown: {
    accommodation: number
    food: number
    localTransport: number
    sightseeing: number
    miscellaneous: number
  }
  totalBudget: number
  perPersonBudget: number
  moneySavingTips: string[]
}

export interface SavedTrip {
  id: string
  destinationId: string
  destinationName: string
  stateOrRegion: string
  country: string
  coverImage: string
  savedAt: string
  notes?: string
  hasItinerary: boolean
  itineraryId?: string
  plannedDates?: string
}
