import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Compass, Video, Trash2, ArrowUpRight, MapPin, Plus } from 'lucide-react'
import { api } from '../lib/api'
import { VideoAnalysisJob } from '../types'

export default function DiscoveriesPage() {
  const [jobs, setJobs] = useState<VideoAnalysisJob[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await api.getRecentDiscoveries()
    setJobs(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this discovery record?')) {
      await api.deleteDiscovery(id)
      loadData()
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            to="/analyze"
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Analyze New Video
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-teal-400" />
            My Video Discoveries
          </h1>
          <p className="text-sm text-navy-400 mt-1">
            All videos processed by the AI pipeline with extracted landmark clues and identified destinations.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <div key={n} className="h-64 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
            <Video className="w-12 h-12 text-navy-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No video discoveries yet</h3>
            <p className="text-xs text-navy-400 mt-1 max-w-sm mx-auto">
              Upload your first travel reel to extract landmarks and build a full itinerary.
            </p>
            <Link to="/analyze" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-bold">
              Analyze Video
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const topCand = job.candidates[0]
              return (
                <div key={job.id} className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video overflow-hidden">
                      <img src={job.thumbnailUrl} alt={job.videoFileName} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur text-xs font-bold text-teal-300">
                        {topCand ? `${topCand.confidence}% Match` : 'Completed'}
                      </div>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 text-navy-400 hover:text-red-400 hover:bg-black/90 transition-colors"
                        title="Delete discovery"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        {topCand ? `${topCand.name}, ${topCand.country}` : 'Destination Found'}
                      </div>
                      <h3 className="font-semibold text-sm text-white truncate">{job.videoFileName}</h3>
                      <p className="text-xs text-navy-400 line-clamp-2 leading-relaxed">
                        {topCand?.summary || 'Video analyzed with landmarks.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-navy-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/analysis/${job.id}`}
                      className="font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                    >
                      View Report <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
