import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-900/90 to-navy-950/95" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-8"
          >
            <Play className="w-8 h-8 text-teal-400" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Next Trip Starts{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              With a Video
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-navy-300 max-w-2xl mx-auto mb-10">
            Upload your favorite travel videos and let AI discover the destinations,
            plan your itinerary, and make your dream trip a reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="/#how-it-works"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur text-white text-lg font-medium rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-6 text-navy-500 text-sm">
            Free to start · No credit card required · Analyze your first video in minutes
          </p>
        </motion.div>
      </div>
    </section>
  )
}
