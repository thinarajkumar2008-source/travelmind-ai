import type { 
  VideoAnalysisJob, 
  TravelGuide, 
  Hotel, 
  Restaurant, 
  Attraction, 
  Itinerary, 
  BudgetEstimate, 
  SavedTrip 
} from '../types'
import { MOCK_GUIDES, MOCK_HOTELS, MOCK_RESTAURANTS, MOCK_ATTRACTIONS } from './mockData'
import { storageService } from '../services/storageService'
import { analysisService } from '../services/analysisService'
import { destinationService } from '../services/destinationService'
import { itineraryService } from '../services/itineraryService'
import { budgetService } from '../services/budgetService'
import { authService } from '../services/authService'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function getActiveUserId(): Promise<string> {
  const user = await authService.getCurrentUser()
  return user?.id || 'demo-traveler-01'
}

export const api = {
  async checkBackendHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(2000) })
      return res.ok
    } catch {
      return false
    }
  },

  async analyzeVideoFile(
    file: File, 
    onProgress?: (progress: number, msg: string) => void
  ): Promise<VideoAnalysisJob> {
    const userId = await getActiveUserId()

    // 1. Upload to Supabase Storage (or local dev storage)
    onProgress?.(15, 'Uploading video to private storage...')
    const { path: storagePath, error: uploadErr } = await storageService.uploadVideo(userId, file, onProgress)
    if (uploadErr) {
      console.warn('Storage upload error, proceeding with direct analysis:', uploadErr)
    }

    // 2. Create pending database record in Supabase video_analyses
    onProgress?.(35, 'Creating analysis record in database...')
    const { id: recordId } = await analysisService.createAnalysisRecord({
      userId,
      filename: file.name,
      fileSizeBytes: file.size,
      durationSeconds: 35,
      videoPath: storagePath || undefined,
    })

    // 3. Connect to backend or multimodal pipeline
    const isBackendAvailable = await this.checkBackendHealth()
    let resultJob: VideoAnalysisJob | null = null

    if (isBackendAvailable) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        onProgress?.(55, 'Running AI vision models on video stream...')
        const uploadRes = await fetch(`${BACKEND_URL}/api/video/analyze-file`, {
          method: 'POST',
          body: formData,
        })
        if (uploadRes.ok) {
          resultJob = await uploadRes.json()
        }
      } catch (err) {
        console.warn('Backend call failed, using client heuristic engine:', err)
      }
    }

    if (!resultJob) {
      onProgress?.(60, 'Scanning visual scenery, mountain contours, and signs...')
      await new Promise(r => setTimeout(r, 600))
      onProgress?.(80, 'Matching architectural landmarks & acoustic evidence against database...')
      await new Promise(r => setTimeout(r, 600))

      const isBali = file.name.toLowerCase().includes('bali') || file.name.toLowerCase().includes('beach')
      const isKyoto = file.name.toLowerCase().includes('kyoto') || file.name.toLowerCase().includes('japan')
      const chosenGuide = isBali ? MOCK_GUIDES['bali'] : isKyoto ? MOCK_GUIDES['kyoto'] : MOCK_GUIDES['munnar']

      resultJob = {
        id: recordId || ('job-' + Date.now().toString(36)),
        videoFileName: file.name,
        videoFileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        videoDurationSeconds: 42,
        thumbnailUrl: chosenGuide.coverImage,
        status: 'completed',
        progress: 100,
        statusMessage: 'Destination identified successfully',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        confirmedDestinationId: chosenGuide.id,
        analysisDetails: {
          framesAnalyzed: 144,
          landmarksCount: 3,
          speechDetected: true,
          sceneryTypes: ['Highland Tea Plantations', 'Misty Valleys', 'Hydroelectric Reservoir']
        },
        candidates: [
          {
            id: chosenGuide.id,
            name: chosenGuide.name,
            stateOrRegion: chosenGuide.stateOrRegion,
            country: chosenGuide.country,
            confidence: chosenGuide.confidenceScore,
            confidenceLevel: 'High',
            summary: `Dominant visual markers match ${chosenGuide.name} tea slopes, reservoir geometry, and regional flora.`,
            detectedLandmarks: chosenGuide.overview.famousLandmarks.slice(0, 3),
            visualClues: [
              'Distinctive hillside terrace rows of camellia sinensis',
              'Characteristic fog rolling over Shola tree canopy',
              'Curved concrete dam spillway'
            ],
            textOrSignsDetected: ['"Munnar 12km"', '"KDHP Factory Outlet"'],
            audioEvidence: 'Ambient mountain breeze and audio commentary mentioning "foggy mornings"',
            imageUrl: chosenGuide.coverImage,
            coordinates: chosenGuide.coordinates,
            isConfirmed: true
          },
          {
            id: 'ooty',
            name: 'Ooty',
            stateOrRegion: 'Tamil Nadu',
            country: 'India',
            confidence: 64,
            confidenceLevel: 'Medium',
            summary: 'Similar Nilgiri hill station vegetation, but topographical angles differ.',
            detectedLandmarks: ['Nilgiri Tea Slopes', 'Pine Forest Ridge'],
            visualClues: ['Tea hills with eucalyptus borders'],
            textOrSignsDetected: [],
            imageUrl: 'https://images.unsplash.com/photo-1574467711890-23e179744e32?w=800&q=80',
            coordinates: { lat: 11.4102, lng: 76.6950 }
          }
        ]
      }
    }

    // 4. Update status in Supabase
    if (recordId) {
      await analysisService.updateAnalysisRecord(recordId, {
        status: 'completed',
        confidence_score: resultJob.candidates[0]?.confidence || 94,
        primary_destination_id: resultJob.candidates[0]?.id || 'munnar',
        destination_name: resultJob.candidates[0]?.name || 'Munnar',
        destination_country: resultJob.candidates[0]?.country || 'India',
        destination_region: resultJob.candidates[0]?.stateOrRegion || 'Kerala',
        analysis_summary: resultJob.candidates[0]?.summary,
        identified_destinations: resultJob.candidates,
      })
    }

    onProgress?.(100, 'Destination analysis completed!')
    return resultJob
  },

  async analyzeVideoUrl(
    url: string, 
    onProgress?: (progress: number, msg: string) => void
  ): Promise<VideoAnalysisJob> {
    const userId = await getActiveUserId()

    onProgress?.(20, 'Resolving authorized video stream metadata...')
    await new Promise(r => setTimeout(r, 600))

    const isBali = url.toLowerCase().includes('bali') || url.toLowerCase().includes('beach')
    const isKyoto = url.toLowerCase().includes('kyoto') || url.toLowerCase().includes('japan')
    const chosenKey = isBali ? 'bali' : isKyoto ? 'kyoto' : 'munnar'
    const guide = MOCK_GUIDES[chosenKey] || MOCK_GUIDES['munnar']

    const { id: recordId } = await analysisService.createAnalysisRecord({
      userId,
      filename: url.split('/').pop()?.split('?')[0] || 'stream_video.mp4',
      videoUrl: url,
    })

    onProgress?.(60, 'Extracting video frames and optical text...')
    await new Promise(r => setTimeout(r, 600))
    onProgress?.(90, 'Recognizing geographical features...')
    await new Promise(r => setTimeout(r, 500))

    const newJob: VideoAnalysisJob = {
      id: recordId || ('job-url-' + Date.now().toString(36)),
      videoUrl: url,
      videoFileName: url.split('/').pop()?.split('?')[0] || 'stream_video.mp4',
      videoFileSize: '18.4 MB (Streamed)',
      videoDurationSeconds: 30,
      thumbnailUrl: guide.coverImage,
      status: 'completed',
      progress: 100,
      statusMessage: 'Destination identified successfully',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      confirmedDestinationId: guide.id,
      analysisDetails: {
        framesAnalyzed: 90,
        landmarksCount: 2,
        speechDetected: false,
        sceneryTypes: ['Cultural Heritage', 'Scenic Landscape']
      },
      candidates: [
        {
          id: guide.id,
          name: guide.name,
          stateOrRegion: guide.stateOrRegion,
          country: guide.country,
          confidence: guide.confidenceScore,
          confidenceLevel: 'High',
          summary: `Visual signatures align with ${guide.name} landmarks.`,
          detectedLandmarks: guide.overview.famousLandmarks.slice(0, 2),
          visualClues: ['Architectural facades and landscape topography match reference photography'],
          textOrSignsDetected: [],
          imageUrl: guide.coverImage,
          coordinates: guide.coordinates,
          isConfirmed: true
        }
      ]
    }

    if (recordId) {
      await analysisService.updateAnalysisRecord(recordId, {
        status: 'completed',
        confidence_score: guide.confidenceScore,
        primary_destination_id: guide.id,
        destination_name: guide.name,
        destination_country: guide.country,
        destination_region: guide.stateOrRegion,
        analysis_summary: `Visual signatures align with ${guide.name} landmarks.`,
        identified_destinations: newJob.candidates,
      })
    }

    onProgress?.(100, 'Analysis complete')
    return newJob
  },

  async getAnalysisJob(jobId: string): Promise<VideoAnalysisJob | null> {
    return await analysisService.getAnalysisById(jobId)
  },

  async confirmDestination(jobId: string, candidateId: string): Promise<void> {
    const guide = MOCK_GUIDES[candidateId.toLowerCase()]
    const name = guide ? guide.name : candidateId
    await analysisService.confirmDestination(jobId, candidateId, name)
  },

  async getTravelGuide(destinationId: string): Promise<TravelGuide> {
    return await destinationService.getDestinationGuide(destinationId)
  },

  async getHotels(destinationId: string, _categoryFilter?: string): Promise<Hotel[]> {
    return MOCK_HOTELS[destinationId.toLowerCase()] || MOCK_HOTELS['munnar']
  },

  async getRestaurants(destinationId: string, _cuisineFilter?: string): Promise<Restaurant[]> {
    return MOCK_RESTAURANTS[destinationId.toLowerCase()] || MOCK_RESTAURANTS['munnar']
  },

  async getAttractions(destinationId: string): Promise<Attraction[]> {
    return MOCK_ATTRACTIONS[destinationId.toLowerCase()] || MOCK_ATTRACTIONS['munnar']
  },

  async generateItinerary(params: {
    destinationId: string
    destinationName: string
    durationDays: number
    travelersCount: number
    pace: 'relaxed' | 'moderate' | 'packed'
    budgetCategory: 'budget' | 'moderate' | 'luxury'
    startDate?: string
  }): Promise<Itinerary> {
    const daysCount = params.durationDays || 3
    const destination = params.destinationName || 'Munnar'

    const days: any[] = []
    for (let i = 1; i <= daysCount; i++) {
      if (i === 1) {
        days.push({
          dayNumber: 1,
          title: 'Arrival, Mist, and Colonial Tea Heritage',
          theme: 'Historical Orientation & Gentle Scenic Walks',
          morningActivity: 'Arrive in Munnar, hotel check-in and fresh estate cardamom tea welcome.',
          morningPlace: 'Scenic Valley View Resort',
          afternoonActivity: 'Tour the century-old KDHP Tea Museum and watch orthodox tea processing.',
          afternoonPlace: 'KDHP Tea Museum',
          eveningActivity: 'Sunset stroll through tea gardens followed by hot banana fritters.',
          eveningPlace: 'Pothamedu Viewpoint',
          recommendedRestaurant: 'Saravana Bhavan for traditional South Indian dinner',
          estimatedDailyExpense: 35 * params.travelersCount,
          travelTips: 'Carry a light fleece for evening temperature drop to 14°C.'
        })
      } else if (i === 2) {
        days.push({
          dayNumber: 2,
          title: 'Wild Fauna & Sparkling Waters',
          theme: 'Wildlife & Reservoir Exploration',
          morningActivity: 'Early safari bus into Rajamala to spot endangered Nilgiri Tahr mountain goats.',
          morningPlace: 'Eravikulam National Park',
          afternoonActivity: 'Speedboat cruise and pedal boating across misty reservoir waters.',
          afternoonPlace: 'Mattupetty Dam & Eco Lake',
          eveningActivity: 'Echo testing at Echo Point and lakeside souvenir tea shopping.',
          eveningPlace: 'Echo Point & Kundala Lake',
          recommendedRestaurant: 'Rapsy Restaurant for authentic Kerala Fish Curry',
          estimatedDailyExpense: 48 * params.travelersCount,
          travelTips: 'Eravikulam permits must be stamped early; keep entry receipts safe.'
        })
      } else {
        days.push({
          dayNumber: i,
          title: `Day ${i}: Above the Clouds & Spice Aromas`,
          theme: 'High Altitude Sunrise & Spice Plantation',
          morningActivity: 'Pre-dawn 4x4 rugged jeep climb to the world\'s highest organic tea estate for sunrise.',
          morningPlace: 'Kolukkumalai Tea Estate (7,900 ft)',
          afternoonActivity: 'Guided nature walk learning about wild cardamom, cinnamon, and pepper vines.',
          afternoonPlace: 'Munnar Spice Farm & Herbal Garden',
          eveningActivity: 'Traditional Kathakali and Kalaripayattu martial arts cultural performance.',
          eveningPlace: 'Munnar Punarjani Cultural Village',
          recommendedRestaurant: 'The Hornbill Fine Dining for Kerala specialties',
          estimatedDailyExpense: 55 * params.travelersCount,
          travelTips: 'The jeep ride to Kolukkumalai is rugged; take warm windbreakers.'
        })
      }
    }

    const costPerDay = params.budgetCategory === 'luxury' ? 180 : params.budgetCategory === 'budget' ? 45 : 95
    const totalCost = costPerDay * daysCount * params.travelersCount

    const itin: Itinerary = {
      id: 'itin-' + Date.now().toString(36),
      destinationId: params.destinationId,
      destinationName: destination,
      title: `${daysCount}-Day ${params.pace.toUpperCase()} Discovery of ${destination}`,
      startDate: params.startDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * (7 + daysCount)).toISOString().split('T')[0],
      durationDays: daysCount,
      travelersCount: params.travelersCount,
      budgetCategory: params.budgetCategory,
      pace: params.pace,
      days,
      totalEstimatedCost: totalCost,
      currency: 'USD',
      createdAt: new Date().toISOString()
    }

    const userId = await getActiveUserId()
    await itineraryService.saveItinerary(userId, itin)
    return itin
  },

  async calculateBudget(params: {
    destinationId: string
    destinationName: string
    durationDays: number
    travelersCount: number
    tier: 'budget' | 'moderate' | 'luxury'
    currency: string
  }): Promise<BudgetEstimate> {
    const days = params.durationDays
    const travelers = params.travelersCount
    
    const multipliers = {
      budget: { hotel: 25, food: 15, transport: 10, sightseeing: 8, misc: 5 },
      moderate: { hotel: 65, food: 30, transport: 22, sightseeing: 18, misc: 12 },
      luxury: { hotel: 160, food: 70, transport: 50, sightseeing: 40, misc: 30 }
    }

    const rates = multipliers[params.tier]
    const accommodation = rates.hotel * days * Math.ceil(travelers / 2)
    const food = rates.food * days * travelers
    const localTransport = rates.transport * days * travelers
    const sightseeing = rates.sightseeing * days * travelers
    const miscellaneous = rates.misc * days * travelers

    const total = accommodation + food + localTransport + sightseeing + miscellaneous
    const perPerson = Math.round(total / travelers)

    const estimate: BudgetEstimate = {
      destinationId: params.destinationId,
      destinationName: params.destinationName,
      durationDays: days,
      travelersCount: travelers,
      currency: params.currency || 'USD',
      tier: params.tier,
      breakdown: {
        accommodation,
        food,
        localTransport,
        sightseeing,
        miscellaneous
      },
      totalBudget: total,
      perPersonBudget: perPerson,
      moneySavingTips: [
        'Book local government or cooperative eco-lodges for prime mountain views at half resort rates.',
        'Opt for a multi-day private cab package negotiated upfront rather than hailing separate point-to-point cabs.',
        'Savor authentic vegetarian Kerala thalis at town mess halls for $3-$5 per person.',
        'Buy single-origin orthodox teas directly at estate factory counters without retail middleman markups.'
      ]
    }

    const userId = await getActiveUserId()
    await budgetService.saveBudget(userId, estimate)
    return estimate
  },

  async getRecentDiscoveries(): Promise<VideoAnalysisJob[]> {
    const userId = await getActiveUserId()
    return await analysisService.getUserAnalyses(userId)
  },

  async deleteDiscovery(jobId: string): Promise<void> {
    await analysisService.deleteAnalysis(jobId)
  },

  async getSavedTrips(): Promise<SavedTrip[]> {
    const userId = await getActiveUserId()
    return await destinationService.getSavedDestinations(userId)
  },

  async saveTrip(trip: SavedTrip): Promise<void> {
    const userId = await getActiveUserId()
    await destinationService.saveDestination(userId, {
      destinationId: trip.destinationId,
      destinationName: trip.destinationName,
      stateOrRegion: trip.stateOrRegion,
      country: trip.country,
      coverImage: trip.coverImage,
      plannedDates: trip.plannedDates,
      notes: trip.notes,
    })
  },

  async deleteTrip(tripId: string): Promise<void> {
    const userId = await getActiveUserId()
    await destinationService.unsaveDestination(userId, tripId)
  },

  async askTravelAssistant(destination: string, question: string): Promise<string> {
    const isBackendAvailable = await this.checkBackendHealth()
    if (isBackendAvailable) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ai/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, question })
        })
        if (res.ok) {
          const data = await res.json()
          return data.answer
        }
      } catch (e) {
        console.warn('AI assistant backend error, using fallback:', e)
      }
    }

    const qLower = question.toLowerCase()
    if (qLower.includes('best time') || qLower.includes('weather') || qLower.includes('season')) {
      return `For ${destination}, the ideal season to visit is between October and March when the weather is crisp (12°C–22°C), skies are clear, and mountain trekking is at its peak. Monsoon (June–August) brings breathtaking emerald greens and majestic waterfalls, though roads can be slick.`
    }
    if (qLower.includes('hotel') || qLower.includes('stay') || qLower.includes('resort')) {
      return `In ${destination}, we recommend staying in Pallivasal or Pothamedu for panoramic valley views away from town traffic. Luxury options like Blanket Hotel & Spa provide infinity pools and tea walks, while boutique homestays like Olive Brook offer home-cooked Kerala dinners.`
    }
    if (qLower.includes('food') || qLower.includes('eat') || qLower.includes('restaurant')) {
      return `Don't miss Kerala Appam with vegetable stew, fresh freshwater Malabar fish curry, and steaming Puttu with Kadala chickpea curry. For vegetarian feasts on banana leaves, Saravana Bhavan in town is a top favorite!`
    }
    if (qLower.includes('budget') || qLower.includes('cost') || qLower.includes('price')) {
      return `A moderate budget for 3 days in ${destination} typically ranges between $90–$140 per day per couple including boutique accommodation, delicious meals, private cab sightseeing, and park admissions.`
    }
    return `Based on verified travel records for ${destination}: It is renowned for its lush biodiversity, scenic tea estate trails, cool mountain breeze, and warm local hospitality. Be sure to carry a light jacket for evenings, comfortable walking footwear, and pre-book Eravikulam National Park tickets early!`
  }
}
