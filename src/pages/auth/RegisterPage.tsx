import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Compass, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+91 ')
  const [place, setPlace] = useState('Kochi, Kerala')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(true)
  
  // OTP Verification state within registration
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null)
  
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, sendOtp, continueWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    if (cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number first.')
      return
    }
    setError('')
    const res = await sendOtp(cleanPhone)
    if (res.success) {
      setOtpSent(true)
      if (res.code) setSimulatedCode(res.code)
    } else {
      setError(res.error || 'Failed to send OTP')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!acceptTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const res = await register(email, password, fullName, phone, place)
    setSubmitting(false)

    if (res.success) {
      navigate('/dashboard')
    } else {
      setError(res.error || 'Failed to create account. Please try again.')
    }
  }

  const handleGoogleQuickSignup = async () => {
    setError('')
    setSubmitting(true)
    const res = await continueWithGoogle({
      name: fullName || 'Aarav Sharma',
      email: email || 'aarav.sharma@gmail.com',
      phone: phone.length > 5 ? phone : '+91 98401 23456',
      place: place || 'Kochi, Kerala',
    })
    setSubmitting(false)
    if (res.success) {
      navigate('/dashboard')
    }
  }

  const quickCities = ['Kochi, Kerala', 'Bengaluru, Karnataka', 'Chennai, Tamil Nadu', 'Mumbai, Maharashtra', 'Delhi NCR']

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

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
        <h2 className="text-center text-3xl font-extrabold text-white">Create Traveler Account</h2>
        <p className="mt-2 text-center text-sm text-navy-400">
          Provide your home city to receive tailored nearby road trips and travel discoveries
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {/* Quick Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleQuickSignup}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-navy-900 bg-white hover:bg-slate-100 shadow-xl transition-all mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google (Gmail)</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-navy-950 px-2 text-navy-400">Or register with mobile & email</span>
            </div>
          </div>

          {/* Simulated SMS Code Alert */}
          {simulatedCode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs shadow-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-teal-300">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  📱 SMS Code Sent to {phone} [₹0 Demo Mode]
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[10px] text-teal-300 font-mono">
                  Valid 5 mins
                </span>
              </div>
              <div className="flex items-center justify-between bg-navy-950/60 p-2.5 rounded-xl border border-teal-500/20">
                <div>
                  <p className="text-[11px] text-navy-400">Verification OTP:</p>
                  <p className="text-xl font-mono font-extrabold text-white tracking-widest">{simulatedCode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedCode)}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold"
                >
                  Apply Code
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            {/* 2. Customer Mobile Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider">
                  Mobile Number (SMS Verification)
                </label>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-teal-400 hover:underline font-medium"
                  >
                    Send Test SMS OTP
                  </button>
                ) : (
                  <span className="text-xs text-teal-300 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> SMS Sent
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>
              {otpSent && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit SMS OTP"
                    className="flex-1 px-3 py-1.5 bg-navy-900 border border-teal-500/40 rounded-lg text-white font-mono text-center tracking-widest text-sm focus:outline-none"
                  />
                  <span className="text-xs text-teal-300">Verified & Ready</span>
                </div>
              )}
            </div>

            {/* 3. Gmail / Email */}
            <div>
              <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5">
                Gmail / Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.traveler@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            {/* 4. User Place / Hometown */}
            <div>
              <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5">
                Your Place / City (To Suggest Nearby Escapes)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="e.g. Kochi, Bengaluru, Chennai..."
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {quickCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPlace(c)}
                    className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${
                      place === c ? 'bg-teal-500 text-white font-medium' : 'bg-white/5 hover:bg-white/10 text-navy-300'
                    }`}
                  >
                    {c.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-navy-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6+ chars"
                    className="w-full pl-9 pr-8 py-2 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-navy-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-navy-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-teal-500 focus:ring-teal-400 border-navy-700 bg-navy-900"
                />
                <span className="text-xs text-navy-300 leading-snug">
                  I agree to the{' '}
                  <Link to="/terms" className="text-teal-400 hover:underline">Terms</Link> and{' '}
                  <Link to="/privacy" className="text-teal-400 hover:underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all mt-4"
            >
              {submitting ? 'Creating Account...' : 'Complete Registration & Start Exploring'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-navy-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-400 hover:text-teal-300">
              Sign In with SMS OTP or Google
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
