import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { UserPreferences } from '../types'

export interface ProfileRecord {
  id: string
  full_name: string | null
  avatar_url: string | null
  home_city: string | null
  preferred_language: string
  preferred_currency: string
  travel_preferences: any
  created_at: string
  updated_at: string
}

export const profileService = {
  async getProfile(userId: string): Promise<ProfileRecord | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_profile_' + userId)
      if (stored) return JSON.parse(stored)
      return {
        id: userId,
        full_name: 'Alex Vance',
        avatar_url: null,
        home_city: 'San Francisco',
        preferred_language: 'en',
        preferred_currency: 'USD',
        travel_preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.warn('Error fetching profile from Supabase:', error.message)
      return null
    }
    return data
  },

  async updateProfile(userId: string, updates: Partial<ProfileRecord>) {
    if (!isSupabaseConfigured) {
      const current = await this.getProfile(userId)
      const updated = { ...current, ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem('travelmind_profile_' + userId, JSON.stringify(updated))
      return { data: updated, error: null }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    return { data, error: error?.message || null }
  },
}

export const preferenceService = {
  async getPreferences(userId: string): Promise<UserPreferences> {
    const fallback: UserPreferences = {
      categories: ['Nature', 'Culture', 'Scenic Viewpoints'],
      travelPace: 'moderate',
      accommodationPreference: 'boutique',
      foodPreference: ['Local Delicacies', 'Vegetarian Options'],
      preferredCurrency: 'USD',
      theme: 'system',
    }

    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_preferences')
      return stored ? JSON.parse(stored) : fallback
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) return fallback

    return {
      categories: data.preferred_activities || fallback.categories,
      travelPace: (data.preferred_travel_style as any) || 'moderate',
      accommodationPreference: (data.preferred_accommodation as any) || 'boutique',
      foodPreference: data.dietary_preferences || fallback.foodPreference,
      preferredCurrency: data.preferred_currency || 'USD',
      accessibilityNeeds: Array.isArray(data.accessibility_preferences) ? data.accessibility_preferences.join(', ') : undefined,
      theme: (data.theme as any) || 'system',
    }
  },

  async updatePreferences(userId: string, prefs: Partial<UserPreferences>) {
    if (!isSupabaseConfigured) {
      const current = await this.getPreferences(userId)
      const updated = { ...current, ...prefs }
      localStorage.setItem('travelmind_preferences', JSON.stringify(updated))
      return { data: updated, error: null }
    }

    const payload: any = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    }
    if (prefs.travelPace) payload.preferred_travel_style = prefs.travelPace
    if (prefs.accommodationPreference) payload.preferred_accommodation = prefs.accommodationPreference
    if (prefs.preferredCurrency) payload.preferred_currency = prefs.preferredCurrency
    if (prefs.categories) payload.preferred_activities = prefs.categories
    if (prefs.foodPreference) payload.dietary_preferences = prefs.foodPreference
    if (prefs.theme) payload.theme = prefs.theme

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert(payload)
      .select()
      .single()

    return { data, error: error?.message || null }
  },
}
