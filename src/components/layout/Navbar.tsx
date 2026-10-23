import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Compass, ChevronRight, User, Sparkles } from 'lucide-react'
import { SITE_NAME, NAV_LINKS } from '../../lib/constants'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070B14]/90 backdrop-blur-2xl shadow-2xl shadow-black/60 border-b border-white/10'
          : 'bg-gradient-to-b from-[#070B14]/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Cartographic Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <img
                src="/images/travelmind-logo.png"
                alt="TRAVELMIND AI official travel logo"
                className="h-12 md:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_14px_rgba(255,184,107,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg md:text-xl font-black tracking-wider text-[#F5F7FB] font-display">
                  TRAVELMIND
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#42E8D8]/15 border border-[#42E8D8]/30 text-[10px] font-extrabold tracking-widest text-[#42E8D8]">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-[#9BA9BD] font-mono tracking-wider uppercase hidden sm:inline">
                Cinematic Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const isInternalRoute = link.href.startsWith('/') && !link.href.includes('#')
              const isActive = location.pathname === link.href

              if (isInternalRoute) {
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'text-[#42E8D8] bg-[#42E8D8]/10 border border-[#42E8D8]/25 shadow-sm'
                        : 'text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/[0.05]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#42E8D8]" />
                    )}
                  </Link>
                )
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/[0.05] transition-all duration-200"
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/analyze"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] hover:from-[#8AF7EF] hover:to-[#42E8D8] text-[#070B14] text-xs font-bold tracking-wide transition-all duration-300 shadow-lg shadow-[#42E8D8]/20 hover:shadow-[#42E8D8]/40 hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#070B14]" />
              <span>Analyze Video</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F5F7FB] transition-all"
              >
                <User className="w-3.5 h-3.5 text-[#42E8D8]" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F5F7FB] transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-[#F5F7FB] hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#070B14]/98 border-t border-white/10 backdrop-blur-2xl shadow-2xl"
          >
            <div className="px-5 py-5 space-y-1.5">
              <div className="flex items-center gap-3 pb-3 mb-2 border-b border-white/10">
                <img
                  src="/images/travelmind-logo.png"
                  alt="TRAVELMIND AI official travel logo"
                  className="h-10 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-wider text-[#F5F7FB] font-display">
                    TRAVELMIND <span className="text-[#42E8D8]">AI</span>
                  </span>
                  <span className="text-[9px] text-[#9BA9BD] font-mono tracking-wider uppercase">
                    Cinematic Intelligence
                  </span>
                </div>
              </div>
              {NAV_LINKS.map((link) => {
                const isInternalRoute = link.href.startsWith('/') && !link.href.includes('#')
                if (isInternalRoute) {
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        location.pathname === link.href
                          ? 'bg-[#42E8D8]/15 text-[#42E8D8] border border-[#42E8D8]/30'
                          : 'text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/[0.05]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                }
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#9BA9BD] hover:text-[#F5F7FB] hover:bg-white/[0.05] transition-colors"
                  >
                    {link.label}
                  </a>
                )
              })}

              <hr className="my-3 border-white/10" />

              <Link
                to="/analyze"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#42E8D8] to-[#25C2B4] text-[#070B14] font-bold text-sm shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Travel Video
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
