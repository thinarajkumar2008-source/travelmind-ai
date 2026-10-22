export const SITE_NAME = 'TravelMind AI'
export const SITE_TAGLINE = 'Turn Every Travel Video Into Your Next Adventure.'
export const SITE_HERO_HEADLINE = 'Every Journey Has a Story. Discover Where It Leads.'
export const SITE_HERO_SUBTITLE = 'Turn travel videos into destination discoveries. Explore remarkable places, find nearby attractions, and plan your next adventure with TRAVELMIND AI.'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Discover', href: '/#destinations' },
  { label: 'Analyze Video', href: '/analyze' },
  { label: 'Explore Map', href: '/explore-map' },
  { label: 'Travel Planner', href: '/itinerary' },
  { label: 'Saved Trips', href: '/saved-trips' },
] as const

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
] as const

export const MAX_FILE_SIZE_MB = 500
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// OpenStreetMap & Leaflet Config (100% Free - ₹0 - No API Key Needed)
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'

export interface DestinationItem {
  id: string
  name: string
  location: string
  country: string
  latitude: number
  longitude: number
  description: string
  image: string
  rating: number
  category: 'Nature' | 'Hill Station' | 'Beach' | 'Heritage' | 'Tropical' | 'Culture' | 'Mountains' | 'Coastal'
  highlights: string[]
}

export const POPULAR_DESTINATIONS: DestinationItem[] = [
  {
    id: 'munnar',
    name: 'Munnar',
    location: 'Kerala, India',
    country: 'India',
    latitude: 10.0889,
    longitude: 77.0595,
    description: 'Rolling tea gardens, misty Western Ghats mountains, and serene valleys.',
    image: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
    rating: 4.8,
    category: 'Hill Station',
    highlights: ['Eravikulam National Park', 'Mattupetty Dam', 'Tea Museum', 'Anamudi Peak'],
  },
  {
    id: 'bali',
    name: 'Bali',
    location: 'Indonesia',
    country: 'Indonesia',
    latitude: -8.4095,
    longitude: 115.1889,
    description: 'Tropical paradise with ancient water temples, emerald rice terraces, and volcanic coastlines.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.9,
    category: 'Tropical',
    highlights: ['Ubud Monkey Forest', 'Tanah Lot Temple', 'Tegallalang Rice Terrace', 'Mount Batur'],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    location: 'Kansai, Japan',
    country: 'Japan',
    latitude: 35.0116,
    longitude: 135.7681,
    description: 'Ancient imperial capital with bamboo groves, golden zen pavilions, and 1,000 torii gates.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    rating: 4.9,
    category: 'Culture',
    highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji Temple', 'Gion District'],
  },
  {
    id: 'ooty',
    name: 'Ooty',
    location: 'Tamil Nadu, India',
    country: 'India',
    latitude: 11.4102,
    longitude: 76.6950,
    description: 'The Queen of Hill Stations featuring Nilgiri Mountain Toy Train, rose gardens, and tea slopes.',
    image: 'https://images.unsplash.com/photo-1574467711890-23e179744e32?w=800&q=80',
    rating: 4.6,
    category: 'Hill Station',
    highlights: ['Botanical Gardens', 'Ooty Lake', 'Doddabetta Peak', 'Nilgiri Heritage Train'],
  },
  {
    id: 'goa',
    name: 'Goa',
    location: 'Goa, India',
    country: 'India',
    latitude: 15.2993,
    longitude: 74.1240,
    description: 'Sun-kissed Arabian Sea beaches, vibrant night markets, and Portuguese colonial forts.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    rating: 4.7,
    category: 'Beach',
    highlights: ['Palolem Beach', 'Aguada Fort', 'Basilica of Bom Jesus', 'Dudhsagar Falls'],
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    location: 'Rajasthan, India',
    country: 'India',
    latitude: 26.9124,
    longitude: 75.7873,
    description: 'The Royal Pink City adorned with majestic sandstone forts, ornate palaces, and spice bazaars.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    rating: 4.8,
    category: 'Heritage',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
  },
  {
    id: 'swiss-alps',
    name: 'Interlaken & Alps',
    location: 'Bernese Oberland, Switzerland',
    country: 'Switzerland',
    latitude: 46.6863,
    longitude: 7.8632,
    description: 'Glacial alpine lakes, cogwheel mountain trains, and snowcapped peaks of Jungfrau.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    rating: 4.9,
    category: 'Mountains',
    highlights: ['Jungfraujoch Top of Europe', 'Lake Brienz', 'Harder Kulm Viewpoint', 'Lauterbrunnen Valley'],
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    location: 'Campania, Italy',
    country: 'Italy',
    latitude: 40.6340,
    longitude: 14.6027,
    description: 'Dramatic pastel cliffside villages, lemon groves, and azure Mediterranean waters.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    rating: 4.9,
    category: 'Coastal',
    highlights: ['Positano Cliffside', 'Amalfi Cathedral', 'Ravello Gardens', 'Path of the Gods'],
  },
]

export const FEATURES = [
  {
    title: 'AI Destination Detection',
    description: 'Analyze travel videos, shorts, and reels to identify tourist destinations, landmarks, and hidden gems with visual clues.',
    icon: 'Scan',
  },
  {
    title: 'Interactive OpenStreetMap',
    description: '100% free, responsive Leaflet map with interactive markers for attractions, hotels, dining, and custom saved pins.',
    icon: 'MapPin',
  },
  {
    title: 'Complete Travel Guides',
    description: 'Comprehensive destination intelligence with historical context, seasonal weather charts, culture, and safety tips.',
    icon: 'BookOpen',
  },
  {
    title: 'Hotel & Restaurant Discovery',
    description: 'Find verified accommodation and local culinary specialties with directions, external booking search links, and zero-fabrication policies.',
    icon: 'Hotel',
  },
  {
    title: 'Smart Itinerary Builder',
    description: 'Customize day-by-day itineraries with interactive timelines, drag-and-drop planning, travel pace, and notes.',
    icon: 'CalendarDays',
  },
  {
    title: 'Travel Budget Estimator',
    description: 'Transparent budget projections covering lodging, food, transit, and entrance fees in multiple global currencies.',
    icon: 'Wallet',
  },
] as const

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Upload or Search',
    description: 'Upload your travel video (MP4/WebM), paste a public video URL, or search for any destination manually at ₹0 cost.',
    icon: 'Upload',
  },
  {
    step: 2,
    title: 'AI Landmark Extraction',
    description: 'Our multimodal recognition engine detects architectural landmarks, natural scenery, and geographic indicators with confidence scoring.',
    icon: 'Sparkles',
  },
  {
    step: 3,
    title: 'Explore on Interactive Map',
    description: 'View the identified destination on our OpenStreetMap interface with nearby attractions, accommodations, and culinary hotspots.',
    icon: 'Compass',
  },
  {
    step: 4,
    title: 'Generate Itinerary & Save',
    description: 'Build a customized multi-day itinerary, calculate transparent travel budgets, and bookmark your trip to your personal profile.',
    icon: 'Route',
  },
] as const
