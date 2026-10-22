import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface SavedPlaceRecord {
  id: string
  user_id: string
  destination_id: string | null
  provider_place_id: string | null
  place_name: string
  place_type: 'hotel' | 'restaurant' | 'attraction' | 'viewpoint'
  address: string | null
  latitude: number | null
  longitude: number | null
  image_url: string | null
  price_level: string | null
  rating: number | null
  provider_data: any
  notes: string | null
  created_at: string
}

export const savedPlaceService = {
  async getSavedPlaces(userId: string, placeType?: string): Promise<SavedPlaceRecord[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_places')
      const list: SavedPlaceRecord[] = stored ? JSON.parse(stored) : []
      if (placeType) return list.filter(p => p.place_type === placeType)
      return list
    }

    let query = supabase
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (placeType) {
      query = query.eq('place_type', placeType)
    }

    const { data, error } = await query
    if (error) {
      console.warn('Error fetching saved places:', error.message)
      return []
    }
    return data || []
  },

  async isPlaceSaved(userId: string, placeName: string, placeType: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_places')
      if (!stored) return false
      const list: SavedPlaceRecord[] = JSON.parse(stored)
      return list.some(p => p.place_name === placeName && p.place_type === placeType)
    }

    const { count, error } = await supabase
      .from('saved_places')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('place_name', placeName)
      .eq('place_type', placeType)

    return !error && (count || 0) > 0
  },

  async savePlace(userId: string, place: {
    destinationId?: string
    providerPlaceId?: string
    placeName: string
    placeType: 'hotel' | 'restaurant' | 'attraction' | 'viewpoint'
    address?: string
    latitude?: number
    longitude?: number
    imageUrl?: string
    priceLevel?: string
    rating?: number
    notes?: string
  }) {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_places')
      const list: SavedPlaceRecord[] = stored ? JSON.parse(stored) : []
      if (!list.some(p => p.place_name === place.placeName && p.place_type === place.placeType)) {
        list.unshift({
          id: 'sp-' + Date.now().toString(36),
          user_id: userId,
          destination_id: place.destinationId || null,
          provider_place_id: place.providerPlaceId || null,
          place_name: place.placeName,
          place_type: place.placeType,
          address: place.address || null,
          latitude: place.latitude || null,
          longitude: place.longitude || null,
          image_url: place.imageUrl || null,
          price_level: place.priceLevel || null,
          rating: place.rating || null,
          provider_data: {},
          notes: place.notes || null,
          created_at: new Date().toISOString(),
        })
        localStorage.setItem('travelmind_saved_places', JSON.stringify(list))
      }
      return { success: true }
    }

    const { data, error } = await supabase
      .from('saved_places')
      .upsert({
        user_id: userId,
        destination_id: place.destinationId || null,
        provider_place_id: place.providerPlaceId || null,
        place_name: place.placeName,
        place_type: place.placeType,
        address: place.address || null,
        latitude: place.latitude || null,
        longitude: place.longitude || null,
        image_url: place.imageUrl || null,
        price_level: place.priceLevel || null,
        rating: place.rating || null,
        notes: place.notes || null,
      }, { onConflict: 'user_id, place_name, place_type' })
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async unsavePlace(userId: string, placeName: string, placeType: string) {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_places')
      if (stored) {
        const list: SavedPlaceRecord[] = JSON.parse(stored)
        localStorage.setItem('travelmind_saved_places', JSON.stringify(list.filter(p => !(p.place_name === placeName && p.place_type === placeType))))
      }
      return { success: true }
    }

    const { error } = await supabase
      .from('saved_places')
      .delete()
      .eq('user_id', userId)
      .eq('place_name', placeName)
      .eq('place_type', placeType)

    return { success: !error, error: error?.message }
  }
}
