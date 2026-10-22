import { motion } from 'framer-motion'
import { Upload, Sparkles, Compass, Route } from 'lucide-react'
import { HOW_IT_WORKS_STEPS } from '../../lib/constants'

const iconMap: Record<string, React.ElementType> = {
  Upload, Sparkles, Compass, Route,
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-navy-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-coral-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            From Video to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Travel Guide
            </span>{' '}
            in Minutes
          </h2>
          <p className="text-lg text-navy-400 max-w-2xl mx-auto">
            Our AI transforms any travel video into a comprehensive destination guide
            with hotels, restaurants, attractions, and personalized itineraries.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Upload
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-teal-500/40 to-teal-500/10" />
                )}

                <div className="relative inline-flex mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/20">
                    <Icon className="w-7 h-7 text-teal-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full bg-teal-500 text-white text-xs font-bold shadow-lg">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-navy-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
