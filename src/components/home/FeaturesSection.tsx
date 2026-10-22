import React from 'react'
import { motion } from 'framer-motion'
import { Scan, BookOpen, Hotel, MapPin, CalendarDays, Wallet } from 'lucide-react'
import { FEATURES } from '../../lib/constants'

const iconMap: Record<string, React.ElementType> = {
  Scan, BookOpen, Hotel, MapPin, CalendarDays, Wallet,
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-navy-950 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-4 border border-teal-500/20">
            <Scan className="w-4 h-4" />
            Powerful Free Features (₹0)
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Discover & Plan
            </span>
          </h2>
          <p className="text-base sm:text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed">
            From AI video landmark analysis to interactive OpenStreetMap exploration, TravelMind AI provides comprehensive travel discovery without requiring paid subscriptions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon] || Scan
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative p-7 rounded-3xl border border-white/10 hover:border-teal-400 bg-navy-900/80 hover:bg-navy-900 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300"
              >
                <div className="inline-flex p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-navy-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
