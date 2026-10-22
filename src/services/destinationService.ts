import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { SavedTrip, TravelGuide } from '../types'
import { MOCK_GUIDES } from '../lib/mockData'

export const destinationService = {
  async getDestinationGuide(destinationId: string): Promise<TravelGuide> {
    if (!isSupabaseConfigured) {
      return MOCK_GUIDES[destinationId.toLowerCase()] || MOCK_GUIDES['munnar']
    }

    const { data } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', destinationId.toLowerCase())
      .single()

    if (data && data.destination_details?.overview) {
      return data.destination_details
    }

    return MOCK_GUIDES[destinationId.toLowerCase()] || MOCK_GUIDES['munnar']
  },

  async getSavedDestinations(userId: string): Promise<SavedTrip[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_trips')
      if (stored) return JSON.parse(stored)
      return [
        {
          id: 'saved-munnar',
          destinationId: 'munnar',
          destinationName: 'Munnar',
          stateOrRegion: 'Kerala',
          country: 'India',
          coverImage: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
          savedAt: new Date().toISOString(),
          hasItinerary: true,
          plannedDates: 'Oct 15 - Oct 18, 2025',
          notes: 'Discovered from Kerala travel video'
        }
      ]
    }

    const { data, error } = await supabase
      .from('saved_destinations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map((d: any) => ({
      id: d.id,
      destinationId: d.destination_id,
      destinationName: d.destination_name,
      stateOrRegion: d.state_or_region || '',
      country: d.country,
      coverImage: d.cover_image || 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
      savedAt: d.created_at,
      plannedDates: d.planned_dates || undefined,
      notes: d.notes || undefined,
      hasItinerary: false,
    }))
  },

  async isDestinationSaved(userId: string, destinationId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_trips')
      if (!stored) return false
      const list: SavedTrip[] = JSON.parse(stored)
      return list.some(t => t.destinationId === destinationId)
    }

    const { count, error } = await supabase
      .from('saved_destinations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('destination_id', destinationId)

    return !error && (count || 0) > 0
  },

  async saveDestination(userId: string, trip: {
    destinationId: string
    destinationName: string
    stateOrRegion: string
    country: string
    coverImage: string
    plannedDates?: string
    notes?: string
  }) {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_trips')
      const list: SavedTrip[] = stored ? JSON.parse(stored) : []
      if (!list.some(t => t.destinationId === trip.destinationId)) {
        list.unshift({
          id: 'saved-' + trip.destinationId,
          ...trip,
          savedAt: new Date().toISOString(),
          hasItinerary: false,
        })
        localStorage.setItem('travelmind_saved_trips', JSON.stringify(list))
      }
      return { success: true }
    }

    const { data, error } = await supabase
      .from('saved_destinations')
      .upsert({
        user_id: userId,
        destination_id: trip.destinationId,
        destination_name: trip.destinationName,
        state_or_region: trip.stateOrRegion,
        country: trip.country,
        cover_image: trip.coverImage,
        planned_dates: trip.plannedDates || null,
        notes: trip.notes || null,
      }, { onConflict: 'user_id, destination_id' })
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async unsaveDestination(userId: string, destinationId: string) {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_saved_trips')
      if (stored) {
        const list: SavedTrip[] = JSON.parse(stored)
        localStorage.setItem('travelmind_saved_trips', JSON.stringify(list.filter(t => t.destinationId !== destinationId && t.id !== destinationId)))
      }
      return { success: true }
    }

    const { error } = await supabase
      .from('saved_destinations')
      .delete()
      .eq('user_id', userId)
      .or(`destination_id.eq.${destinationId},id.eq.${destinationId}`)

    return { success: !error, error: error?.message }
  }
}
