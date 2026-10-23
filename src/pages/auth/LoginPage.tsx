import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Compass, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  MapPin, 
  User as UserIcon, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Car,
  Navigation
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NearbyDestinationsSection from '../../components/destinations/NearbyDestinationsSection'

export default function LoginPage() {
  const navigate = useNavigate()
  const { 
    login, 
    sendOtp, 
    verifyOtp, 
    continueWithGoogle, 
    demoLogin, 
    isLocalDevMode 
  } = useAuth()

  // Authentication mode: 'phone' (SMS OTP) | 'google' | 'email'
  const [authMode, setAuthMode] = useState<'phone' | 'google' | 'email'>('phone')

  // Phone OTP Flow states
  const [phoneNumber, setPhoneNumber] = useState('+91 ')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Profile details required: Name, Gmail, Phone, User Place
  const [fullName, setFullName] = useState('')
  const [gmail, setGmail] = useState('')
  const [userPlace, setUserPlace] = useState('Kochi, Kerala')

  // Email / Password mode states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Status & Feedback
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Success celebration modal showing nearby places
  const [verifiedSuccess, setVerifiedSuccess] = useState(false)

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Handle Send SMS OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')
    setSuccessMsg('')

    const clean = phoneNumber.replace(/[^0-9+]/g, '')
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number with country code (e.g. +91 9876543210)')
      return
    }

    setSubmitting(true)
    const res = await sendOtp(clean)
    setSubmitting(false)

    if (res.success) {
      setOtpSent(true)
      setResendCooldown(30)
      if (res.code) {
        setSimulatedCode(res.code)
      }
      setSuccessMsg(`SMS verification code sent to ${clean}!`)
    } else {
      setError(res.error || 'Failed to send SMS OTP. Please check the mobile number.')
    }
  }

  // Handle Verify SMS OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await verifyOtp(phoneNumber, otpCode, {
      name: fullName.trim() || 'Traveler',
      email: gmail.trim() || `traveler.${phoneNumber.slice(-4)}@gmail.com`,
      place: userPlace.trim() || 'Kochi, Kerala',
    })
    setSubmitting(false)

    if (res.success) {
      setVerifiedSuccess(true)
    } else {
      setError(res.error || 'Invalid OTP code. Please check and try again.')
    }
  }

  // Handle "Continue with Google"
  const handleContinueWithGoogle = async () => {
    setError('')
    setSubmitting(true)
    const res = await continueWithGoogle({
      name: fullName.trim() || 'Aarav Sharma',
      email: gmail.trim() || 'aarav.sharma@gmail.com',
      phone: phoneNumber.length > 5 ? phoneNumber : '+91 98401 23456',
      place: userPlace.trim() || 'Bengaluru, Karnataka',
    })
    setSubmitting(false)

    if (res.success) {
      setVerifiedSuccess(true)
    } else {
      setError(res.error || 'Google sign in failed. Please try again.')
    }
  }

  // Handle Email & Password
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await login(email, password)
    setSubmitting(false)

    if (res.success) {
      navigate('/dashboard')
    } else {
      setError(res.error || 'Failed to sign in. Please verify your email and password.')
    }
  }

  const quickPlaces = ['Kochi, Kerala', 'Bengaluru, Karnataka', 'Chennai, Tamil Nadu', 'Mumbai, Maharashtra', 'Delhi NCR']

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <Link to="/" className="flex flex-col items-center justify-center gap-2 mb-6 group">
          <img
            src="/images/travelmind-logo.png"
            alt="TRAVELMIND AI official travel logo"
            className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_16px_rgba(255,184,107,0.35)]"
          />
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-black text-white tracking-wider font-display">
              TRAVELMIND <span className="text-teal-400">AI</span>
            </span>
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Sign In to Your Adventure
        </h2>
        <p className="mt-2 text-center text-sm text-navy-400">
          Verify via Mobile SMS OTP or Continue with Google to get instant nearby travel recommendations
        </p>
      </div>

      {/* Main Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        {/* Verification Success & Nearby Places Recommendation Overlay */}
        <AnimatePresence>
          {verifiedSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy-900/90 backdrop-blur-2xl border border-teal-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                <CheckCircle2 className="w-8 h-8 text-teal-400 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Verification Complete! Welcome, {fullName || 'Traveler'} 🎉
                  </h3>
                  <p className="text-xs text-teal-300">
                    Mobile: <span className="font-semibold">{phoneNumber}</span> • City: <span className="font-semibold">{userPlace}</span>
                  </p>
                </div>
              </div>

              {/* Instant Nearby Places Suggestion based on Collected User Place */}
              <div>
                <NearbyDestinationsSection
                  initialPlace={userPlace}
                  userName={fullName}
                  compact={true}
                  showTitle={true}
                  onPlaceChange={(newPlace) => setUserPlace(newPlace)}
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-teal-500/30 transition-all text-sm"
                >
                  <span>Go to Traveler Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/explore-map')}
                  className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium border border-white/10 transition-all text-sm"
                >
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>View on Free Atlas</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
              {/* Method Switcher Tabs */}
              <div className="flex bg-navy-900/80 p-1 rounded-2xl border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => { setAuthMode('phone'); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    authMode === 'phone'
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                      : 'text-navy-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Mobile SMS OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('google'); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    authMode === 'google'
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                      : 'text-navy-400 hover:text-white'
                  }`}
                >
                  <span>Google (Gmail)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('email'); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    authMode === 'email'
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                      : 'text-navy-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
              </div>

              {/* Real-time SMS Simulator Banner (₹0 Zero-Cost Requirement) */}
              {simulatedCode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs shadow-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-teal-300">
                      <MessageSquare className="w-4 h-4 text-teal-400" />
                      📱 SMS Delivered to {phoneNumber} [100% Free Demo Mode]
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[10px] text-teal-300 font-mono">
                      Valid 5 mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-navy-950/60 p-2.5 rounded-xl border border-teal-500/20">
                    <div>
                      <p className="text-[11px] text-navy-400">Your TravelMind verification code is:</p>
                      <p className="text-xl font-mono font-extrabold text-white tracking-widest">{simulatedCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpCode(simulatedCode)}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-all"
                    >
                      Auto-Fill Code
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Success Alert */}
              {successMsg && !simulatedCode && (
                <div className="mb-6 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-sm text-teal-300">
                  {successMsg}
                </div>
              )}

              {/* MODE 1: MOBILE SMS OTP */}
              {authMode === 'phone' && (
                <div className="space-y-5">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      {/* Mobile Number Input */}
                      <div>
                        <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-2">
                          Customer Mobile Number (SMS OTP)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
                            <Phone className="w-5 h-5" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-11 pr-4 py-3 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all"
                          />
                        </div>
                        <p className="text-[11px] text-navy-400 mt-1.5">
                          We will send a 6-digit SMS verification code to this mobile number.
                        </p>
                      </div>

                      {/* User Profile Details to Collect: Name, Gmail & Place */}
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Personalize Your Travel Recommendations</span>
                        </div>

                        <div>
                          <label className="block text-xs text-navy-300 mb-1">Your Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-navy-500" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Rahul Sharma"
                              className="w-full pl-9 pr-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-navy-300 mb-1">Gmail / Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-navy-500" />
                            <input
                              type="email"
                              value={gmail}
                              onChange={(e) => setGmail(e.target.value)}
                              placeholder="e.g. rahul@gmail.com"
                              className="w-full pl-9 pr-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-navy-300 mb-1">
                            Your Place / Current City (To Suggest Nearby Places)
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-navy-500" />
                            <input
                              type="text"
                              value={userPlace}
                              onChange={(e) => setUserPlace(e.target.value)}
                              placeholder="e.g. Kochi, Kerala or Bengaluru..."
                              className="w-full pl-9 pr-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                          </div>
                          {/* Quick Place Selection Chips */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {quickPlaces.map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setUserPlace(p)}
                                className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${
                                  userPlace === p
                                    ? 'bg-teal-500 text-white font-medium'
                                    : 'bg-white/5 hover:bg-white/10 text-navy-300'
                                }`}
                              >
                                {p.split(',')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all"
                      >
                        {submitting ? 'Sending SMS OTP...' : 'Send SMS Verification Code'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider">
                            Enter 6-Digit SMS Code
                          </label>
                          <button
                            type="button"
                            onClick={() => { setOtpSent(false); setSimulatedCode(null) }}
                            className="text-xs text-teal-400 hover:underline"
                          >
                            Change Number ({phoneNumber})
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="482910"
                          autoFocus
                          className="w-full py-3 text-center tracking-widest text-2xl font-mono font-bold bg-navy-900/80 border border-teal-500/40 rounded-xl text-white placeholder-navy-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-navy-400">
                        <span>Didn't receive SMS?</span>
                        {resendCooldown > 0 ? (
                          <span className="text-navy-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Resend in {resendCooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-teal-400 hover:underline font-medium"
                          >
                            Resend SMS OTP
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all"
                      >
                        {submitting ? 'Verifying...' : 'Verify OTP & Discover Near Places'}
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* MODE 2: CONTINUE WITH GOOGLE FOR GMAIL */}
              {authMode === 'google' && (
                <div className="space-y-5">
                  <div className="text-center py-2">
                    <p className="text-sm text-navy-300">
                      Sign in seamlessly using your Google account to sync your travel discoveries and itineraries.
                    </p>
                  </div>

                  {/* Profile customization before one-click auth */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm Your Travel Details</span>
                    </div>

                    <div>
                      <label className="block text-xs text-navy-300 mb-1">Gmail Address</label>
                      <input
                        type="email"
                        value={gmail || 'traveler.google@gmail.com'}
                        onChange={(e) => setGmail(e.target.value)}
                        className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-navy-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName || 'Aarav Sharma'}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-navy-300 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber.length > 5 ? phoneNumber : '+91 98401 23456'}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-navy-300 mb-1">
                        Your Place / City (To Suggest Nearby Places)
                      </label>
                      <input
                        type="text"
                        value={userPlace}
                        onChange={(e) => setUserPlace(e.target.value)}
                        className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Official Google Button */}
                  <button
                    type="button"
                    onClick={handleContinueWithGoogle}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-navy-900 bg-white hover:bg-slate-100 shadow-xl transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              )}

              {/* MODE 3: EMAIL & PASSWORD */}
              {authMode === 'email' && (
                <form className="space-y-4" onSubmit={handleEmailSubmit}>
                  <div>
                    <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="traveler@example.com"
                        className="w-full pl-11 pr-4 py-3 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-teal-400 hover:text-teal-300">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all"
                  >
                    {submitting ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Bottom quick switch to register */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-navy-400">
                <span>Don't have an account?</span>
                <Link to="/register" className="font-semibold text-teal-400 hover:text-teal-300">
                  Create new account &rarr;
                </Link>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
