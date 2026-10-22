import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '../types'

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured
  },

  async getSession() {
    if (!isSupabaseConfigured) return null
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.warn('Get session error:', error)
      return null
    }
    return session
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_user')
      return stored ? JSON.parse(stored) : null
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return {
      id: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || 'Traveler',
      createdAt: user.created_at,
    }
  },

  async signUp(email: string, password: string, fullName: string) {
    if (!isSupabaseConfigured) {
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        fullName,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('travelmind_user', JSON.stringify(mockUser))
      return { user: mockUser, error: null }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) return { user: null, error: error.message }
    const user: User | null = data.user ? {
      id: data.user.id,
      email: data.user.email || '',
      fullName,
    } : null
    return { user, error: null }
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        fullName: email.split('@')[0].replace(/[._]/g, ' '),
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('travelmind_user', JSON.stringify(mockUser))
      return { user: mockUser, error: null }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { user: null, error: error.message }
    const user: User | null = data.user ? {
      id: data.user.id,
      email: data.user.email || '',
      fullName: data.user.user_metadata?.full_name || 'Traveler',
    } : null
    return { user, error: null }
  },

  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem('travelmind_user')
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured) {
      return { error: null }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message || null }
  },
}
