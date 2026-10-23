import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Feature & Discovery Pages
import DashboardPage from './pages/DashboardPage'
import VideoAnalyzePage from './pages/VideoAnalyzePage'
import AnalysisResultsPage from './pages/AnalysisResultsPage'
import CompleteTravelGuidePage from './pages/CompleteTravelGuidePage'
import ExploreMapPage from './pages/ExploreMapPage'
import HotelsPage from './pages/HotelsPage'
import RestaurantsPage from './pages/RestaurantsPage'
import AttractionsPage from './pages/AttractionsPage'
import ItineraryPage from './pages/ItineraryPage'
import BudgetPage from './pages/BudgetPage'
import DiscoveriesPage from './pages/DiscoveriesPage'
import SavedTripsPage from './pages/SavedTripsPage'
import SettingsPage from './pages/SettingsPage'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isLocalDevMode } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <img
            src="/images/travelmind-logo.png"
            alt="TRAVELMIND AI official travel logo"
            className="h-16 w-auto object-contain animate-pulse"
          />
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        <span className="text-xs text-navy-400 font-mono tracking-widest uppercase">Loading TRAVELMIND AI...</span>
      </div>
    )
  }

  // In local dev mode, allow exploration or redirect to login
  if (!user && !isLocalDevMode) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Feature & Discovery Routes */}
        <Route path="/explore-map" element={<ExploreMapPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/analyze" element={<ProtectedRoute><VideoAnalyzePage /></ProtectedRoute>} />
        <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisResultsPage /></ProtectedRoute>} />
        <Route path="/destination/:id" element={<ProtectedRoute><CompleteTravelGuidePage /></ProtectedRoute>} />
        <Route path="/hotels" element={<ProtectedRoute><HotelsPage /></ProtectedRoute>} />
        <Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
        <Route path="/nearby-attractions" element={<ProtectedRoute><AttractionsPage /></ProtectedRoute>} />
        <Route path="/itinerary" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
        <Route path="/discoveries" element={<ProtectedRoute><DiscoveriesPage /></ProtectedRoute>} />
        <Route path="/saved-trips" element={<ProtectedRoute><SavedTripsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
