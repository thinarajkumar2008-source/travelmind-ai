import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Search, Lightbulb, Shield, Globe, Zap, CheckCircle2 } from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    title: 'Zero Research Hassle',
    description: 'Stop spending hours searching destinations shown in travel reels. Our AI identifies landmarks instantly.',
  },
  {
    icon: Search,
    title: '100% Free OpenStreetMap Integration',
    description: 'Interactive maps with Leaflet and OpenStreetMap tiles. No Google Maps billing or paid API credentials required.',
  },
  {
    icon: Lightbulb,
    title: 'Reliable Recommendations',
    description: 'Explore nearby hotels, local cuisine, and tourist spots with genuine distances and verified directions.',
  },
  {
    icon: Shield,
    title: 'Honest AI Disclosures',
    description: 'We distinguish verified facts from AI estimates so you always know which data is verified and which is suggested.',
  },
  {
    icon: Globe,
    title: 'Global Geographic Coverage',
    description: 'From Kerala hill stations to Japanese bamboo groves and Swiss Alpine passes, explore any spot on the globe.',
  },
  {
    icon: Zap,
    title: 'Zero Cost Commitment (₹0)',
    description: 'Designed specifically for students and independent travelers without needing expensive subscriptions or paid APIs.',
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-24 lg:py-32 bg-navy-950 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-4 border border-teal-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Why TravelMind AI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Stop Researching.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
                Start Exploring.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-navy-300 mb-8 leading-relaxed">
              Traditional travel planning takes hours of searching, comparing, and organizing across fragmented sites.
              TravelMind AI turns visual inspiration into structured travel guides at zero cost.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Videos Processed', value: '10K+' },
                { label: 'Destinations Plotted', value: '190+' },
                { label: 'OpenStreetMap Places', value: '50K+' },
                { label: 'Zero Cost Guarantee', value: '₹0' },
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-navy-900/80 border border-white/10 shadow-lg">
                  <p className="text-3xl font-black text-teal-400">{stat.value}</p>
                  <p className="text-xs text-navy-400 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-navy-500 mt-4 italic">* Demonstrating platform benchmarks and open geographic data coverage.</p>
          </motion.div>

          {/* Right: Benefit Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl bg-navy-900/80 border border-white/10 hover:border-teal-400/50 hover:bg-navy-900 transition-all duration-300"
              >
                <div className="shrink-0 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 h-fit">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-navy-300 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
