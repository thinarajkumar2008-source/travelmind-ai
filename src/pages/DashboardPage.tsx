import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Compass, 
  Video, 
  Sparkles, 
  MapPin, 
  Bookmark, 
  Calendar, 
  Wallet, 
  Settings as SettingsIcon, 
  LogOut, 
  UploadCloud, 
  Link2, 
  ChevronRight, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Menu, 
  X,
  Plus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { VideoAnalysisJob, SavedTrip } from '../types'
import TravelMap, { MapPlace } from '../components/map/TravelMap'
import { POPULAR_DESTINATIONS } from '../lib/constants'
import NearbyDestinationsSection from '../components/destinations/NearbyDestinationsSection'

export default function DashboardPage() {
  const { user, logout, preferences, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recentJobs, setRecentJobs] = useState<VideoAnalysisJob[]>([])
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [jobs, trips] = await Promise.all([
        api.getRecentDiscoveries(),
        api.getSavedTrips()
      ])
      setRecentJobs(jobs)
      setSavedTrips(trips)
      setLoading(false)
    }
    loadData()
  }, [])

  const dashboardMapPlaces: MapPlace[] = React.useMemo(() => {
    const list: MapPlace[] = []
    savedTrips.forEach(t => {
      const match = POPULAR_DESTINATIONS.find(d => d.id === t.destinationId)
      if (match) {
        list.push({
          id: `saved-${t.id}`,
          name: t.destinationName,
          category: 'saved',
          subCategory: 'Saved Trip',
          latitude: match.latitude,
          longitude: match.longitude,
          address: `${t.stateOrRegion || ''}, ${t.country}`,
          image: t.coverImage,
          description: t.notes || 'Saved destination in your travel collection.',
        })
      }
    })

    if (list.length === 0) {
      POPULAR_DESTINATIONS.slice(0, 5).forEach(d => {
        list.push({
          id: `pop-${d.id}`,
          name: d.name,
          category: 'destination',
          subCategory: d.category,
          latitude: d.latitude,
          longitude: d.longitude,
          address: `${d.location}, ${d.country}`,
          image: d.image,
          description: d.description,
        })
      })
    }
    return list
  }, [savedTrips])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { label: 'Overview', icon: Compass, href: '/dashboard', active: true },
    { label: 'Explore Map', icon: MapPin, href: '/explore-map' },
    { label: 'Analyze a Video', icon: Video, href: '/analyze' },
    { label: 'My Discoveries', icon: Sparkles, href: '/discoveries' },
    { label: 'Saved Destinations', icon: Bookmark, href: '/saved-trips' },
    { label: 'My Itineraries', icon: Calendar, href: '/itinerary' },
    { label: 'Travel Budget', icon: Wallet, href: '/budget' },
    { label: 'Settings', icon: SettingsIcon, href: '/settings' },
  ]

  const uniqueDestinationsCount = new Set(recentJobs.map(j => j.confirmedDestinationId).filter(Boolean)).size

  const stats = [
    { label: 'Videos Analyzed', value: recentJobs.length, change: `${recentJobs.length} processed` },
    { label: 'Destinations Discovered', value: uniqueDestinationsCount, change: 'Verified locations' },
    { label: 'Saved Places', value: savedTrips.length, change: 'In your bucket' },
    { label: 'Planned Trips', value: savedTrips.filter(t => t.hasItinerary).length, change: 'Upcoming' },
  ]

  return (
    <div className="min-h-screen bg-navy-950 text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-navy-900 border-r border-white/10 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/travelmind-logo.png"
              alt="TRAVELMIND AI official travel logo"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(255,184,107,0.3)]"
            />
            <div className="flex flex-col">
              <span className="font-black text-base tracking-wider text-white font-display">
                TRAVELMIND <span className="text-teal-400">AI</span>
              </span>
              <span className="text-[9px] text-navy-400 font-mono tracking-wider uppercase">
                Dashboard
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-navy-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user?.fullName || 'Travel Explorer'}</p>
            <p className="text-xs text-navy-400 truncate">{user?.email || 'traveler@travelmind.ai'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                  : 'text-navy-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/10 px-6 sm:px-8 flex items-center justify-between bg-navy-950/80 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-navy-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="lg:hidden flex items-center">
              <img
                src="/images/travelmind-logo.png"
                alt="TRAVELMIND AI official travel logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold">Traveler Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Analyze Video</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Welcome & Primary Action Hero */}
          <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden bg-gradient-to-r from-teal-900/40 via-navy-900 to-navy-900 border border-teal-500/20 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-300 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Ready for exploration
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Traveler'}! ✈️
              </h2>

              {/* Verified Traveler Profile Pill */}
              <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                {user?.place && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <MapPin className="w-3 h-3 text-teal-400" />
                    Origin: <strong className="text-white">{user.place}</strong>
                  </span>
                )}
                {user?.email && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-navy-300 border border-white/10">
                    Gmail: <strong className="text-white">{user.email}</strong>
                  </span>
                )}
                {user?.phone && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-navy-300 border border-white/10">
                    Mobile: <strong className="text-white">{user.phone}</strong>
                  </span>
                )}
              </div>

              <p className="text-navy-300 text-sm sm:text-base leading-relaxed mb-6">
                Turn your Instagram Reels, YouTube Shorts, or vacation clips into complete travel guides with hotels, restaurants, and step-by-step itineraries.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/30 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Video
                </Link>
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/10 transition-all"
                >
                  <Link2 className="w-4 h-4" />
                  Paste Public Link
                </Link>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 w-80 h-80 opacity-20 pointer-events-none">
              <Compass className="w-full h-full text-teal-400 transform translate-x-12 translate-y-12" />
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-teal-500/30 transition-all"
              >
                <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Destinations Near You (Suggested Based on User's Place) */}
          <section className="space-y-4">
            <NearbyDestinationsSection
              initialPlace={user?.place || 'Kochi, Kerala'}
              userName={user?.fullName?.split(' ')[0]}
              onPlaceChange={(newPlace) => updateUserProfile({ place: newPlace })}
            />
          </section>

          {/* Recent Video Discoveries */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                Recent Video Discoveries
              </h3>
              <Link to="/discoveries" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1">
                View All Discoveries
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="h-44 rounded-2xl bg-white/5 animate-pulse" />
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
                <Video className="w-10 h-10 text-navy-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">No videos analyzed yet</p>
                <p className="text-xs text-navy-400 mt-1 max-w-sm mx-auto">
                  Upload your first travel reel to extract landmarks and build a full itinerary.
                </p>
                <Link to="/analyze" className="mt-4 inline-block text-xs font-semibold text-teal-400">
                  + Upload Video Now
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentJobs.slice(0, 3).map((job) => {
                  const topCandidate = job.candidates[0]
                  return (
                    <div 
                      key={job.id} 
                      className="group rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={job.thumbnailUrl} 
                          alt={job.videoFileName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-xs font-medium text-teal-300 border border-teal-500/30">
                          {topCandidate ? `${topCandidate.confidence}% Match` : 'Completed'}
                        </div>
                        <div className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-navy-300">
                          {job.videoFileSize}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold mb-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {topCandidate ? `${topCandidate.name}, ${topCandidate.country}` : 'Destination Found'}
                          </div>
                          <h4 className="font-semibold text-sm text-white truncate mb-2">{job.videoFileName}</h4>
                          <p className="text-xs text-navy-400 line-clamp-2 leading-relaxed">
                            {topCandidate?.summary || 'Video scanned and landmarks extracted.'}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[11px] text-navy-500">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                          <Link 
                            to={`/analysis/${job.id}`} 
                            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                          >
                            View Guide
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Interactive OpenStreetMap of Saved & Discovered Spots */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  Your Travel Map (OpenStreetMap)
                </h3>
                <p className="text-xs text-navy-400 mt-0.5">
                  100% Free Leaflet & OpenStreetMap exploration (₹0). View your saved destinations and bookmarks.
                </p>
              </div>
              <Link
                to="/explore-map"
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                Open Fullscreen Map &rarr;
              </Link>
            </div>

            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-xl">
              <TravelMap
                places={dashboardMapPlaces}
                center={[20.5937, 78.9629]}
                zoom={4}
                height="420px"
                showFilterBar={true}
                showLegend={true}
                showDetailsPane={true}
              />
            </div>
          </section>

          {/* Two-Column Lower Grid: Saved Places & Quick Planner */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Saved Trips */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-teal-400" />
                  Saved Destinations & Trips
                </h3>
                <Link to="/saved-trips" className="text-xs text-teal-400 hover:underline">
                  Manage
                </Link>
              </div>

              {savedTrips.length === 0 ? (
                <p className="text-xs text-navy-400 py-6 text-center">No saved trips yet.</p>
              ) : (
                <div className="space-y-3">
                  {savedTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-all">
                      <img src={trip.coverImage} alt={trip.destinationName} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-white truncate">{trip.destinationName}</h4>
                        <p className="text-xs text-navy-400">{trip.stateOrRegion}, {trip.country}</p>
                        {trip.plannedDates && (
                          <span className="inline-block mt-1 text-[11px] text-teal-400 font-medium">
                            📅 {trip.plannedDates}
                          </span>
                        )}
                      </div>
                      <Link 
                        to={`/destination/${trip.destinationId}`}
                        className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 text-xs font-semibold"
                      >
                        Explore
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended for You */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                Recommended For You ({preferences.travelPace} pace)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Munnar', region: 'Kerala, India', img: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=400&q=80', id: 'munnar' },
                  { name: 'Bali', region: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', id: 'bali' },
                  { name: 'Kyoto', region: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80', id: 'kyoto' },
                  { name: 'Jaipur', region: 'Rajasthan, India', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80', id: 'jaipur' },
                ].map((rec) => (
                  <Link
                    key={rec.id}
                    to={`/destination/${rec.id}`}
                    className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-white/5 hover:border-teal-400/50 transition-all block"
                  >
                    <img src={rec.img} alt={rec.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <p className="font-semibold text-xs text-white">{rec.name}</p>
                      <p className="text-[10px] text-navy-300">{rec.region}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
