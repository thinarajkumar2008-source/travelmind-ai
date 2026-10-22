import { motion } from 'framer-motion'
import { Play, MapPin, Star, CheckCircle2, AlertCircle, Hotel, UtensilsCrossed, Camera, Sparkles } from 'lucide-react'

export default function ExampleDiscoverySection() {
  return (
    <section className="py-24 lg:py-32 bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-coral-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            See It In Action
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            AI Discovery{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Example
            </span>
          </h2>
          <p className="text-lg text-navy-400 max-w-2xl mx-auto">
            Here's what happens when you upload a travel video from Kerala, India.
            Our AI identifies destinations and generates a complete travel guide.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Video Analysis Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              {/* Video Thumbnail */}
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80"
                  alt="Kerala travel video"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-white/20 backdrop-blur">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                  Analysis Complete
                </span>
              </div>

              {/* Analysis Results */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">kerala_travel_vlog.mp4</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Munnar, Kerala, India</p>
                      <p className="text-teal-400 text-xs">92% confidence · Tea gardens, mountains detected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Mattupetty Dam</p>
                      <p className="text-navy-400 text-xs">67% confidence · Water body and dam structure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Eravikulam National Park</p>
                      <p className="text-navy-400 text-xs">58% confidence · Mountain wildlife and grasslands</p>
                    </div>
                  </div>
                </div>

                <p className="text-navy-500 text-xs italic">* This is a demonstration of AI analysis output</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Generated Travel Guide Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              Generated Travel Guide Preview
            </h3>

            {[
              {
                icon: MapPin,
                title: 'Destination Overview',
                text: 'Munnar is a hill station in the Western Ghats of Kerala, famous for its vast tea plantations, rolling green hills, and cool climate.',
              },
              {
                icon: Hotel,
                title: 'Nearby Hotels',
                text: '15 hotels found within 10km including resorts, homestays, and budget stays. Prices from verified providers.',
              },
              {
                icon: UtensilsCrossed,
                title: 'Local Restaurants',
                text: '12 restaurants serving Kerala cuisine, South Indian, and multi-cuisine. Try appam, puttu, and Kerala fish curry.',
              },
              {
                icon: Camera,
                title: 'Things to Do',
                text: 'Visit Eravikulam National Park, explore tea museums, trek to Anamudi Peak, enjoy valley viewpoints.',
              },
              {
                icon: Star,
                title: 'Best Time to Visit',
                text: 'September to May. Peak season: October to February. Monsoon season (June-August) brings heavy rainfall.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-colors"
              >
                <div className="shrink-0 p-2 rounded-lg bg-teal-500/10">
                  <item.icon className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium mb-1">{item.title}</h4>
                  <p className="text-navy-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}

            <p className="text-navy-500 text-xs italic pt-2">* Demonstration content for illustration</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
