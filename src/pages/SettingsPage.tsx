import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Settings as SettingsIcon, 
  Compass, 
  User, 
  Shield, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  LogOut,
  Save
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { profileService, preferenceService } from '../services/profileService'

export default function SettingsPage() {
  const { user, preferences, updatePreferences, logout } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName || 'Alex Vance')
  const [pace, setPace] = useState(preferences.travelPace)
  const [currency, setCurrency] = useState(preferences.preferredCurrency)
  const [theme, setTheme] = useState(preferences.theme)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (user?.id) {
        const profile = await profileService.getProfile(user.id)
        if (profile?.full_name) setFullName(profile.full_name)
        const prefs = await preferenceService.getPreferences(user.id)
        if (prefs) {
          setPace(prefs.travelPace)
          setCurrency(prefs.preferredCurrency)
          setTheme(prefs.theme)
        }
      }
    }
    loadData()
  }, [user?.id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (user?.id) {
      await profileService.updateProfile(user.id, { full_name: fullName })
      await preferenceService.updatePreferences(user.id, {
        travelPace: pace,
        preferredCurrency: currency,
        theme,
      })
    }

    updatePreferences({
      travelPace: pace,
      preferredCurrency: currency,
      theme,
    })

    setSaving(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleClearHistory = () => {
    if (window.confirm('Clear all your stored local video analyses and saved trip cache?')) {
      localStorage.removeItem('travelmind_jobs')
      localStorage.removeItem('travelmind_saved_trips')
      localStorage.removeItem('travelmind_saved_places')
      alert('All local cache records cleared.')
    }
  }

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs text-navy-400">Supabase User Profile & Settings</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-teal-400" />
            Profile & Preferences
          </h1>
          <p className="text-sm text-navy-400 mt-1">
            Manage your traveler profile, default itinerary pace, and video privacy settings.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Profile and preferences updated successfully in Supabase!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Card */}
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              Personal Profile
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'traveler@travelmind.ai'}
                  className="w-full bg-navy-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-navy-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              AI Travel Planner Settings
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">
                  Default Travel Pace
                </label>
                <select
                  value={pace}
                  onChange={(e) => setPace(e.target.value as any)}
                  className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="relaxed">Relaxed & Leisurely</option>
                  <option value="moderate">Moderate & Balanced</option>
                  <option value="fast-paced">Fast-Paced & Packed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">
                  Preferred Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Video Storage Policy */}
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" />
              Video Data & Privacy Controls
            </h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              Videos are uploaded into a private, isolated Supabase Storage bucket (`travel-videos`) under your authenticated user ID. Object-level access policies ensure other users cannot read or download your private files.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                Clear Local Video & Cache History
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-navy-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
