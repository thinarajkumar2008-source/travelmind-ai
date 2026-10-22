import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Itinerary } from '../types'

export const itineraryService = {
  async getUserItineraries(userId: string): Promise<Itinerary[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_itineraries_' + userId)
      return stored ? JSON.parse(stored) : []
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.warn('Error fetching itineraries:', error?.message)
      return []
    }

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      destinationId: row.destination_id || 'munnar',
      destinationName: row.destination_name,
      title: row.title,
      startDate: row.start_date || '',
      endDate: row.end_date || '',
      durationDays: row.duration_days,
      travelersCount: row.number_of_travelers,
      budgetCategory: row.budget_category,
      pace: row.pace,
      days: row.itinerary_data || [],
      totalEstimatedCost: Number(row.total_estimated_cost) || 0,
      currency: row.currency || 'USD',
      createdAt: row.created_at,
    }))
  },

  async saveItinerary(userId: string, itin: Itinerary): Promise<{ id: string; error: string | null }> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_itineraries_' + userId)
      const list: Itinerary[] = stored ? JSON.parse(stored) : []
      const index = list.findIndex(i => i.id === itin.id)
      if (index >= 0) {
        list[index] = itin
      } else {
        list.unshift(itin)
      }
      localStorage.setItem('travelmind_itineraries_' + userId, JSON.stringify(list))
      return { id: itin.id, error: null }
    }

    const payload: any = {
      user_id: userId,
      destination_id: itin.destinationId || null,
      destination_name: itin.destinationName,
      title: itin.title,
      start_date: itin.startDate || null,
      end_date: itin.endDate || null,
      duration_days: itin.durationDays,
      number_of_travelers: itin.travelersCount,
      budget_category: itin.budgetCategory,
      pace: itin.pace,
      itinerary_data: itin.days,
      total_estimated_cost: itin.totalEstimatedCost,
      currency: itin.currency,
      status: 'draft',
      updated_at: new Date().toISOString(),
    }

    // If ID is valid UUID, upsert with id; otherwise insert new
    if (itin.id && itin.id.length > 20 && !itin.id.startsWith('itin-')) {
      payload.id = itin.id
    }

    const { data, error } = await supabase
      .from('itineraries')
      .upsert(payload)
      .select('id')
      .single()

    if (error) return { id: '', error: error.message }
    return { id: data.id, error: null }
  },

  async deleteItinerary(userId: string, id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_itineraries_' + userId)
      if (stored) {
        const list: Itinerary[] = JSON.parse(stored)
        localStorage.setItem('travelmind_itineraries_' + userId, JSON.stringify(list.filter(i => i.id !== id)))
      }
      return true
    }

    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    return !error
  }
}
