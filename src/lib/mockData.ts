import { TravelGuide, Hotel, Restaurant, Attraction, VideoAnalysisJob, Itinerary } from '../types'

export const MOCK_GUIDES: Record<string, TravelGuide> = {
  'munnar': {
    id: 'munnar',
    name: 'Munnar',
    stateOrRegion: 'Kerala',
    country: 'India',
    tagline: 'The Emerald Hills of God\'s Own Country',
    coverImage: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'
    ],
    confidenceScore: 94,
    coordinates: { lat: 10.0889, lng: 77.0595 },
    overview: {
      description: 'Perched at an elevation of 1,600 meters in the Western Ghats mountain range of Kerala, Munnar is a serene hill station enveloped in sprawling tea plantations, misty valleys, rolling hills, and cascading waterfalls. Once the summer resort of the British Raj, Munnar is now one of the world\'s premier tea-growing centers.',
      geography: 'Nestled at the confluence of three mountain streams—Mudhirapuzha, Nallathanni, and Kundaly—in the Idukki district. It is surrounded by the highest peak in South India, Anamudi (2,695m).',
      history: 'Discovered in the late 19th century by British surveyor Benjamin S. Turneaure and pioneer planter A.H. Sharp, who planted the first tea saplings in 1877.',
      culturalSignificance: 'Rich indigenous tribal heritage (Mannan and Muthuvan tribes), renowned for the legendary Neelakurinji flower that blooms once every twelve years, turning the hills purplish-blue.',
      famousLandmarks: ['Mattupetty Dam', 'Eravikulam National Park', 'Anamudi Peak', 'Tata Tea Museum', 'Echo Point', 'Top Station'],
      localCustoms: ['Respect nature reserve rules & stay on paved paths in tea estates', 'Dress modestly when visiting local temples and churches', 'Support local tea grower cooperatives by buying directly from factory outlets']
    },
    bestTimeToVisit: {
      peakSeason: 'October to March (Crisp 12°C - 22°C, misty mornings, ideal for trekking)',
      shoulderSeason: 'April to May (Mild spring, cool mountain breezes, perfect family holiday)',
      monsoonOrOffSeason: 'June to September (Heavy rainfall, lush emerald green landscapes, landslides possible on ghat roads)',
      weatherSummary: 'Subtropical highland climate with refreshing temperatures year-round. Nights can dip to 8°C in December-January.',
      monthlyTemperatures: [
        { month: 'Jan', tempC: 18, rainfallMm: 12 },
        { month: 'Mar', tempC: 22, rainfallMm: 45 },
        { month: 'May', tempC: 24, rainfallMm: 110 },
        { month: 'Jul', tempC: 19, rainfallMm: 380 },
        { month: 'Sep', tempC: 20, rainfallMm: 210 },
        { month: 'Nov', tempC: 19, rainfallMm: 95 }
      ],
      clothingAdvice: 'Pack layers: light woolens for daytime, warm fleece or jacket for misty evenings, and sturdy walking shoes with rain gear.'
    },
    visitorInfo: {
      entryFees: 'Eravikulam National Park: ₹200 (Indian), ₹500 (Foreign nationals); Tea Museum: ₹125.',
      timings: 'Attractions typically open 8:30 AM to 5:00 PM. Eravikulam is closed during calving season (Feb-March).',
      nearestAirport: 'Cochin International Airport (COK) — 110 km (~3.5 hours drive through scenic ghats)',
      nearestRailway: 'Aluva Railway Station (115 km) or Ernakulam Junction (130 km)',
      localTransport: ['Private Taxis & Cabs', 'Auto-rickshaws for short trips', 'KSRTC Public Buses', 'Guided Jeep Safaris to Kolukkumalai'],
      accessibilityNotes: 'Due to hilly terrain, several viewpoints have uneven walkways. The Tea Museum and Mattupetty boat dock are wheelchair accessible.',
      safetyTips: [
        'Drive cautiously on winding hairpin bends, especially in thick fog',
        'Carry motion sickness medication for the hill road ascent',
        'Stay alert for wild elephant crossings near Chinnakanal & Anakulam'
      ]
    },
    thingsToDo: [
      {
        id: 'todo-1',
        title: 'Spot the Endangered Nilgiri Tahr at Eravikulam',
        category: 'Nature',
        description: 'Take a safari bus up to Rajamala inside Eravikulam National Park to witness the majestic Nilgiri Tahr grazing amidst rolling alpine grasslands.',
        duration: '3 - 4 hours',
        suitableFor: 'All travelers & wildlife photographers'
      },
      {
        id: 'todo-2',
        title: 'Sunrise Jeep Trek to Kolukkumalai Peak',
        category: 'Adventure',
        description: 'Ride a 4x4 rugged jeep before dawn to reach the world\'s highest tea plantation at 7,900 feet for an unforgettable sunrise above the clouds.',
        duration: '4 - 5 hours',
        suitableFor: 'Adventure seekers & sunrise enthusiasts'
      },
      {
        id: 'todo-3',
        title: 'Tea Tasting & Crafting at KDHP Tea Museum',
        category: 'Culture',
        description: 'Explore the century-old industrial rollers, learn the orthodox tea making process, and taste freshly plucked single-estate black teas.',
        duration: '2 hours',
        suitableFor: 'Tea lovers & history buffs'
      },
      {
        id: 'todo-4',
        title: 'Boating on Mattupetty Reservoir',
        category: 'Relaxation',
        description: 'Speedboat or peaceful pontoon boating amidst serene waters flanked by tea-carpeted slopes and Shola forests.',
        duration: '1.5 hours',
        suitableFor: 'Families & couples'
      }
    ],
    foodAndCulture: {
      specialties: [
        { name: 'Kerala Sadya & Appam with Stew', description: 'Fluffy fermented rice pancakes served with aromatic coconut milk vegetable or chicken stew.', isVeg: true },
        { name: 'Malabar Fish Curry & Tapioca (Kappa)', description: 'Freshwater fish cooked with kokum (kudampuli), mustard seeds, and rich coconut gravy.', isVeg: false },
        { name: 'Puttu and Kadala Curry', description: 'Steamed rice cylinders layered with grated coconut, served with spicy black chickpea gravy.', isVeg: true },
        { name: 'Fresh Estate Cardamom Spiced Tea', description: 'Cardamom and ginger brewed fresh with estate-plucked tea leaves and creamy cow milk.', isVeg: true }
      ],
      diningTips: [
        'Look for clean local "mess" eateries for authentic Kerala thalis served on banana leaves',
        'Traditional roadside tea stalls serve piping hot banana fritters (pazham pori) at 4 PM'
      ],
      etiquette: ['Eating with the right hand is traditional', 'Tipping 5-10% is customary in standalone restaurants']
    },
    hotelsCount: 18,
    restaurantsCount: 14,
    attractionsCount: 12
  },
  'bali': {
    id: 'bali',
    name: 'Bali',
    stateOrRegion: 'Bali Province',
    country: 'Indonesia',
    tagline: 'Island of the Gods, Temples, and Surf',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'
    ],
    confidenceScore: 91,
    coordinates: { lat: -8.4095, lng: 115.1889 },
    overview: {
      description: 'Bali is an Indonesian island celebrated for its forested volcanic mountains, iconic rice paddies, pristine coral reefs, and deeply spiritual Hindu culture with over 20,000 temples.',
      geography: 'Part of the Lesser Sunda Islands, situated between Java to the west and Lombok to the east, dominated by Mount Agung volcano.',
      history: 'Inhabited since 2000 BC; blossomed into a cultural sanctuary for Javanese artists and scholars following the Majapahit Empire in the 16th century.',
      culturalSignificance: 'Balinese Hinduism (Agama Hindu Dharma), sacred Barong dances, daily Canang Sari floral offerings, and Subak irrigation philosophy (Tri Hita Karana).',
      famousLandmarks: ['Uluwatu Temple', 'Tanah Lot', 'Tegallalang Rice Terrace', 'Mount Batur', 'Sacred Monkey Forest Ubud'],
      localCustoms: ['Wear a sarong and sash when entering any temple complex', 'Never touch anyone on the head or step on street Canang Sari offerings']
    },
    bestTimeToVisit: {
      peakSeason: 'April to October (Dry season, low humidity, sunny skies, best surf)',
      shoulderSeason: 'May & September (Great balance of sunny weather with smaller crowds)',
      monsoonOrOffSeason: 'November to March (Tropical rains, warm oceans, lush green rice fields)',
      weatherSummary: 'Tropical warm climate ranging between 26°C and 31°C year-round.',
      monthlyTemperatures: [
        { month: 'Jan', tempC: 27, rainfallMm: 345 },
        { month: 'Apr', tempC: 28, rainfallMm: 95 },
        { month: 'Jul', tempC: 26, rainfallMm: 40 },
        { month: 'Oct', tempC: 28, rainfallMm: 80 }
      ],
      clothingAdvice: 'Breathable cotton and linen clothing, sun protection, light rain jacket during wet months.'
    },
    visitorInfo: {
      entryFees: 'Tourist Levy: IDR 150,000 (~$10 USD). Uluwatu: IDR 50,000; Tegallalang: IDR 25,000.',
      timings: 'Temples are open daylight hours (7:00 AM - 7:00 PM).',
      nearestAirport: 'Ngurah Rai International Airport (DPS) in Denpasar',
      nearestRailway: 'No railway network on Bali; road transport only',
      localTransport: ['Scooter/Motorbike rental', 'Private Driver with Car', 'Ride-hail apps (Grab, Gojek)'],
      accessibilityNotes: 'Historic temple stairs can be steep; newer resorts and beach walkways in Sanur offer great accessibility.',
      safetyTips: ['Rent motorbikes only with an international driver permit and helmet', 'Avoid drinking tap water; drink bottled or filtered water']
    },
    thingsToDo: [
      {
        id: 'bali-1',
        title: 'Sunset Kecak Fire Dance at Uluwatu Cliff Temple',
        category: 'Culture',
        description: 'Watch the dramatic choral chanting against a blazing Pacific sunset overlooking 70-meter cliff drops.',
        duration: '2.5 hours',
        suitableFor: 'Everyone'
      },
      {
        id: 'bali-2',
        title: 'Dawn Sunrise Trek up Mount Batur Volcano',
        category: 'Adventure',
        description: 'Hike 1,717 meters under star-studded skies and enjoy breakfast steam-cooked on volcanic fissures.',
        duration: '5 hours',
        suitableFor: 'Fit travelers'
      }
    ],
    foodAndCulture: {
      specialties: [
        { name: 'Nasi Campur Bali', description: 'Steamed rice served with spiced meats, sate lilit, lawar vegetables, and fiery sambal matah.', isVeg: false },
        { name: 'Gado-Gado', description: 'Blanched garden vegetables, boiled eggs, tofu, and tempeh tossed in rich peanut sauce.', isVeg: true }
      ],
      diningTips: ['Eat at family-run Warungs for the most genuine Balinese flavors at unmatched prices.'],
      etiquette: ['Do not use your left hand to hand money or food.']
    },
    hotelsCount: 24,
    restaurantsCount: 22,
    attractionsCount: 16
  },
  'kyoto': {
    id: 'kyoto',
    name: 'Kyoto',
    stateOrRegion: 'Kansai',
    country: 'Japan',
    tagline: 'The Cultural Heart of Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80'
    ],
    confidenceScore: 96,
    coordinates: { lat: 35.0116, lng: 135.7681 },
    overview: {
      description: 'Kyoto was Japan\'s imperial capital for over a millennium. It is celebrated worldwide for its thousands of classical Buddhist temples, Shinto shrines, imperial palaces, traditional wooden machiya townhouses, and refined Kaiseki cuisine.',
      geography: 'Situated in a valley in the Yamashiro Basin, bordered by the Higashiyama mountains to the east and the Arashiyama hills to the west.',
      history: 'Established in 794 AD as Heian-kyo; spared from major devastation in World War II, preserving priceless treasures and UNESCO World Heritage sites.',
      culturalSignificance: 'Birthplace of the Japanese tea ceremony (Chado), Geisha arts in Gion, Zen rock gardens, and traditional kimono craftsmanship.',
      famousLandmarks: ['Fushimi Inari Taisha', 'Kinkaku-ji (Golden Pavilion)', 'Kiyomizu-dera', 'Arashiyama Bamboo Grove', 'Gion District'],
      localCustoms: ['Silence your phone on trains and public buses', 'Remove shoes when stepping onto tatami mats', 'Do not photograph geishas or maikos without explicit permission in private alleys']
    },
    bestTimeToVisit: {
      peakSeason: 'Spring (Late March - April) for Cherry Blossoms & Autumn (November) for fiery red Momiji maples',
      shoulderSeason: 'May & October (Pleasant walking temperatures, vibrant greenery)',
      monsoonOrOffSeason: 'July - August (Hot and humid) & January - February (Cold, but magical snow atop golden pavilions)',
      weatherSummary: 'Four distinct seasons. Spring and autumn are sublime with temps around 15°C - 20°C.',
      monthlyTemperatures: [
        { month: 'Jan', tempC: 5, rainfallMm: 50 },
        { month: 'Apr', tempC: 15, rainfallMm: 115 },
        { month: 'Jul', tempC: 27, rainfallMm: 220 },
        { month: 'Nov', tempC: 12, rainfallMm: 70 }
      ],
      clothingAdvice: 'Comfortable slip-on shoes for temple visits, layered coats in winter/autumn, light linens in summer.'
    },
    visitorInfo: {
      entryFees: 'Fushimi Inari is free 24/7. Kiyomizu-dera: ¥400. Kinkaku-ji: ¥500.',
      timings: 'Most temples open 8:30 AM to 5:00 PM.',
      nearestAirport: 'Kansai International Airport (KIX) — 75 min on JR Haruka Express',
      nearestRailway: 'Kyoto Station (Shinkansen bullet train hub from Tokyo in 2h 15m)',
      localTransport: ['Kyoto Subway & City Bus Network', 'Bicycle rentals (flat city, highly bike-friendly)', 'JR Local Lines'],
      accessibilityNotes: 'Subway stations have elevators; some historic temple stairs require assistance.',
      safetyTips: ['Kyoto is among the safest cities globally', 'Keep hydrated during summer months']
    },
    thingsToDo: [
      {
        id: 'kyo-1',
        title: 'Walk the 10,000 Vermilion Torii Gates at Fushimi Inari',
        category: 'Culture',
        description: 'Hike through sacred mountain tunnels of red torii gates dedicated to the Shinto deity of agriculture and business.',
        duration: '2.5 hours',
        suitableFor: 'All visitors'
      },
      {
        id: 'kyo-2',
        title: 'Morning Serenity at Arashiyama Bamboo Grove',
        category: 'Nature',
        description: 'Wander amidst towering green stalks swaying with soothing natural rustles, best visited at sunrise before crowds arrive.',
        duration: '1.5 hours',
        suitableFor: 'Nature lovers & photographers'
      }
    ],
    foodAndCulture: {
      specialties: [
        { name: 'Kaiseki Ryori', description: 'Exquisite multi-course banquet highlighting seasonal ingredients and artistic plating.', isVeg: false },
        { name: 'Shojin Ryori (Zen Temple Cuisine)', description: 'Ancient vegetarian and vegan temple cuisine made from local tofu, seasonal mountain vegetables, and yuba.', isVeg: true },
        { name: 'Uji Matcha & Wagashi Sweets', description: 'Fresh stone-ground green tea served with delicate seasonal bean paste sweets.', isVeg: true }
      ],
      diningTips: ['Reserve dinner spots in Pontocho Alley weeks in advance for river terrace seating (Kawayuka).'],
      etiquette: ['Never stick chopsticks upright in rice; tipping is not practiced in Japan.']
    },
    hotelsCount: 30,
    restaurantsCount: 35,
    attractionsCount: 20
  }
}

export const MOCK_HOTELS: Record<string, Hotel[]> = {
  'munnar': [
    {
      id: 'h-1',
      destinationId: 'munnar',
      name: 'Blanket Hotel and Spa',
      category: 'Luxury',
      address: 'Attukad Waterfalls, Pallivasal, Munnar 685565',
      distanceKm: 4.2,
      rating: 4.8,
      reviewsCount: 1420,
      pricePerNight: 165,
      currency: 'USD',
      hasVerifiedPrice: true,
      amenities: ['Valley View Balcony', 'Ayurvedic Spa', 'Infinity Pool', 'Free Breakfast', 'Free WiFi', 'Tea Plantation Walk'],
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      bookingUrl: 'https://example.com/book/blanket-hotel',
      phone: '+91 4865 263 700',
      coordinates: { lat: 10.0512, lng: 77.0423 }
    },
    {
      id: 'h-2',
      destinationId: 'munnar',
      name: 'Fragrant Nature Munnar',
      category: 'Resort',
      address: 'Bison Valley Road, Pothamedu, Munnar 685612',
      distanceKm: 5.8,
      rating: 4.7,
      reviewsCount: 890,
      pricePerNight: 140,
      currency: 'USD',
      hasVerifiedPrice: true,
      amenities: ['Fireplace Rooms', 'Spa & Wellness', 'Mountain Biking', 'Multi-cuisine Restaurant', 'Airport Shuttle'],
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      bookingUrl: 'https://example.com/book/fragrant-nature',
      phone: '+91 4865 296 200',
      coordinates: { lat: 10.0435, lng: 77.0512 }
    },
    {
      id: 'h-3',
      destinationId: 'munnar',
      name: 'Olive Brook Heritage Homestay',
      category: 'Homestay',
      address: 'Pothamedu, Near Sunset Point, Munnar 685612',
      distanceKm: 3.1,
      rating: 4.6,
      reviewsCount: 520,
      pricePerNight: 65,
      currency: 'USD',
      hasVerifiedPrice: true,
      amenities: ['Cardamom Farm Walk', 'Home-cooked Kerala Meals', 'Garden Terrace', 'Free WiFi', 'Campfire'],
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      bookingUrl: 'https://example.com/book/olive-brook',
      coordinates: { lat: 10.0612, lng: 77.0621 }
    },
    {
      id: 'h-4',
      destinationId: 'munnar',
      name: 'Munnar Tea Hills Resort',
      category: 'Boutique',
      address: 'NH 49, Anachal, Munnar 685565',
      distanceKm: 8.5,
      rating: 4.5,
      reviewsCount: 710,
      pricePerNight: 85,
      currency: 'USD',
      hasVerifiedPrice: true,
      amenities: ['Panoramic Deck', 'Kids Play Zone', 'Fitness Center', 'Buffet Breakfast', 'Free Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      bookingUrl: 'https://example.com/book/tea-hills',
      coordinates: { lat: 10.0315, lng: 77.0210 }
    }
  ]
}

export const MOCK_RESTAURANTS: Record<string, Restaurant[]> = {
  'munnar': [
    {
      id: 'r-1',
      destinationId: 'munnar',
      name: 'Saravana Bhavan Pure Veg',
      cuisine: ['South Indian', 'Kerala Veg', 'Thali'],
      isVegetarianFriendly: true,
      isPureVeg: true,
      rating: 4.5,
      reviewsCount: 2150,
      priceLevel: '$',
      approxMealForTwo: 12,
      currency: 'USD',
      address: 'Main Bazaar Road, Munnar Town',
      distanceKm: 0.5,
      isOpenNow: true,
      openingHours: '7:00 AM – 10:00 PM daily',
      specialties: ['Ghee Roast Dosa', 'Traditional Kerala Thali', 'Filter Kaapi'],
      imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80',
      contactPhone: '+91 4865 230 450',
      coordinates: { lat: 10.0892, lng: 77.0598 }
    },
    {
      id: 'r-2',
      destinationId: 'munnar',
      name: 'Rapsy Restaurant',
      cuisine: ['Kerala Heritage', 'Biryani', 'Continental'],
      isVegetarianFriendly: true,
      isPureVeg: false,
      rating: 4.3,
      reviewsCount: 1680,
      priceLevel: '$$',
      approxMealForTwo: 18,
      currency: 'USD',
      address: 'Main Street, Near Post Office, Munnar Town',
      distanceKm: 0.4,
      isOpenNow: true,
      openingHours: '7:30 AM – 10:30 PM daily',
      specialties: ['Kerala Beef Fry & Malabar Parotta', 'Spanish Omelette', 'Appam & Chicken Stew'],
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      contactPhone: '+91 4865 230 456',
      coordinates: { lat: 10.0885, lng: 77.0601 }
    },
    {
      id: 'r-3',
      destinationId: 'munnar',
      name: 'The Hornbill Fine Dining',
      cuisine: ['Pan-Indian', 'Continental', 'Tandoor'],
      isVegetarianFriendly: true,
      isPureVeg: false,
      rating: 4.7,
      reviewsCount: 420,
      priceLevel: '$$$',
      approxMealForTwo: 40,
      currency: 'USD',
      address: 'Chithirapuram Post, Munnar',
      distanceKm: 7.2,
      isOpenNow: true,
      openingHours: '12:30 PM – 3:30 PM, 7:00 PM – 10:30 PM',
      specialties: ['Tawa Tiger Prawns', 'Cardamom Crème Brûlée', 'Grilled Fish Pollichathu'],
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      coordinates: { lat: 10.0350, lng: 77.0315 }
    }
  ]
}

export const MOCK_ATTRACTIONS: Record<string, Attraction[]> = {
  'munnar': [
    {
      id: 'a-1',
      destinationId: 'munnar',
      name: 'Eravikulam National Park (Rajamala)',
      category: 'National Park',
      description: 'Habitat of the endangered Nilgiri Tahr mountain goat. Features rolling montane shola-grassland ecosystems and Anamudi peak views.',
      distanceKm: 12.0,
      travelTimeMinutes: 30,
      entryFee: '₹200 (Domestic) / ₹500 (Foreign)',
      openingHours: '7:30 AM – 4:00 PM',
      rating: 4.8,
      reviewsCount: 4320,
      imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
      isFamilyFriendly: true,
      coordinates: { lat: 10.1500, lng: 77.0600 }
    },
    {
      id: 'a-2',
      destinationId: 'munnar',
      name: 'Mattupetty Dam and Lake',
      category: 'Viewpoint',
      description: 'Concrete gravity dam storing water for hydroelectricity. Famous for speedboat rides, misty forest backdrops, and roaming elephants.',
      distanceKm: 11.5,
      travelTimeMinutes: 25,
      entryFee: '₹10 entry / ₹500 speedboat',
      openingHours: '9:30 AM – 5:00 PM',
      rating: 4.6,
      reviewsCount: 3890,
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      isFamilyFriendly: true,
      coordinates: { lat: 10.1064, lng: 77.1245 }
    },
    {
      id: 'a-3',
      destinationId: 'munnar',
      name: 'KDHP Tea Museum',
      category: 'Heritage',
      description: 'Historical museum presenting the evolution of Munnar tea plantations from manual rolling tables to modern CTC production.',
      distanceKm: 2.3,
      travelTimeMinutes: 10,
      entryFee: '₹125 per adult',
      openingHours: '9:00 AM – 4:00 PM (Closed Mondays)',
      rating: 4.5,
      reviewsCount: 2950,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80',
      isFamilyFriendly: true,
      coordinates: { lat: 10.0930, lng: 77.0540 }
    },
    {
      id: 'a-4',
      destinationId: 'munnar',
      name: 'Echo Point & Kundala Lake',
      category: 'Viewpoint',
      description: 'Natural acoustic echo phenomenon set against emerald water, pedal boats, and vibrant flower gardens with cherry blossoms in season.',
      distanceKm: 17.0,
      travelTimeMinutes: 40,
      entryFee: '₹30 per person',
      openingHours: '6:00 AM – 6:00 PM',
      rating: 4.4,
      reviewsCount: 1840,
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      isFamilyFriendly: true,
      coordinates: { lat: 10.1250, lng: 77.1680 }
    }
  ]
}

export const MOCK_ANALYSIS_JOBS: VideoAnalysisJob[] = [
  {
    id: 'job-kerala-001',
    videoFileName: 'kerala_roadtrip_reel.mp4',
    videoFileSize: '42.8 MB',
    videoDurationSeconds: 45,
    thumbnailUrl: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
    status: 'completed',
    progress: 100,
    statusMessage: 'Destination identified with high confidence',
    createdAt: '2025-05-10T14:30:00Z',
    completedAt: '2025-05-10T14:31:12Z',
    confirmedDestinationId: 'munnar',
    analysisDetails: {
      framesAnalyzed: 180,
      landmarksCount: 3,
      speechDetected: true,
      sceneryTypes: ['Terraced Tea Plantations', 'Misty Mountain Ridges', 'Reservoir Water Body']
    },
    candidates: [
      {
        id: 'munnar',
        name: 'Munnar',
        stateOrRegion: 'Kerala',
        country: 'India',
        confidence: 94,
        confidenceLevel: 'High',
        summary: 'Matches tea plantation slopes, Western Ghats mist contours, and landmark structure matching Mattupetty Dam.',
        detectedLandmarks: ['Tata Tea Garden Terraces', 'Mattupetty Reservoir Shoreline', 'Eravikulam Hill Silhouette'],
        visualClues: [
          'Steep terraced emerald camellia sinensis bushes with shade trees (Silver Oak)',
          'Narrow winding single-lane mountain road with milestone markers in Malayalam and English',
          'Characteristic curved concrete spillway consistent with Mattupetty Dam'
        ],
        textOrSignsDetected: ['"KDHP"', '"Welcome to Munnar"', '"Speedboat Booking"'],
        audioEvidence: 'Malayalam folk flute background track with audio commentary mentioning "foggy mornings in Idukki"',
        imageUrl: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
        coordinates: { lat: 10.0889, lng: 77.0595 },
        isConfirmed: true
      },
      {
        id: 'ooty',
        name: 'Ooty (Udhagamandalam)',
        stateOrRegion: 'Tamil Nadu',
        country: 'India',
        confidence: 68,
        confidenceLevel: 'Medium',
        summary: 'Similar Nilgiri tea hills and pine forests, but architectural and vegetation indicators suggest Kerala side.',
        detectedLandmarks: ['Nilgiri Hill Ridges', 'Tea Factory Facade'],
        visualClues: ['Tea slopes and eucalyptus trees', 'Cool cloudy mountain weather'],
        textOrSignsDetected: [],
        imageUrl: 'https://images.unsplash.com/photo-1574467711890-23e179744e32?w=800&q=80',
        coordinates: { lat: 11.4102, lng: 76.6950 }
      },
      {
        id: 'valparai',
        name: 'Valparai',
        stateOrRegion: 'Tamil Nadu',
        country: 'India',
        confidence: 52,
        confidenceLevel: 'Low',
        summary: 'Planted tea plateau in the Anamalai Hills, but lacks the specific dam configuration detected at timestamp 0:18.',
        detectedLandmarks: ['Sholayar Tea Slopes'],
        visualClues: ['Tea bushes and tropical evergreen forest boundary'],
        textOrSignsDetected: [],
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        coordinates: { lat: 10.3242, lng: 76.9558 }
      }
    ]
  }
]
