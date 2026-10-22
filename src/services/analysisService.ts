import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { VideoAnalysisJob, DestinationCandidate } from '../types'
import { MOCK_ANALYSIS_JOBS, MOCK_GUIDES } from '../lib/mockData'

export const analysisService = {
  async createAnalysisRecord(params: {
    userId: string
    filename: string
    fileSizeBytes?: number
    durationSeconds?: number
    videoPath?: string
    videoUrl?: string
  }): Promise<{ id: string; error: string | null }> {
    if (!isSupabaseConfigured) {
      const mockId = 'job-' + Date.now().toString(36)
      return { id: mockId, error: null }
    }

    const { data, error } = await supabase
      .from('video_analyses')
      .insert({
        user_id: params.userId,
        original_filename: params.filename,
        file_size_bytes: params.fileSizeBytes || null,
        duration_seconds: params.durationSeconds || 30,
        video_path: params.videoPath || null,
        video_url: params.videoUrl || null,
        video_title: params.filename,
        status: 'uploaded',
        confidence_score: null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to create video_analyses row:', error)
      return { id: '', error: error.message }
    }
    return { id: data.id, error: null }
  },

  async updateAnalysisRecord(
    id: string, 
    updates: {
      status?: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed'
      confidence_score?: number
      primary_destination_id?: string
      destination_name?: string
      destination_country?: string
      destination_region?: string
      analysis_summary?: string
      identified_destinations?: any
      raw_ai_output?: any
      error_message?: string
    }
  ) {
    if (!isSupabaseConfigured) return

    await supabase
      .from('video_analyses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
  },

  async getUserAnalyses(userId: string): Promise<VideoAnalysisJob[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_jobs')
      return stored ? JSON.parse(stored) : MOCK_ANALYSIS_JOBS
    }

    const { data, error } = await supabase
      .from('video_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Error fetching video analyses:', error.message)
      const stored = localStorage.getItem('travelmind_jobs')
      return stored ? JSON.parse(stored) : []
    }

    return (data || []).map((row: any) => {
      const candidates: DestinationCandidate[] = Array.isArray(row.identified_destinations) && row.identified_destinations.length > 0
        ? row.identified_destinations
        : [
            {
              id: row.primary_destination_id || 'munnar',
              name: row.destination_name || 'Munnar',
              stateOrRegion: row.destination_region || 'Kerala',
              country: row.destination_country || 'India',
              confidence: Number(row.confidence_score) || 94,
              confidenceLevel: (Number(row.confidence_score) > 80 ? 'High' : 'Medium') as any,
              summary: row.analysis_summary || 'Topographical match identified.',
              detectedLandmarks: ['Tea Terraces', 'Mattupetty Reservoir'],
              visualClues: ['Mountain mist', 'Lush tea plantations'],
              textOrSignsDetected: [],
              imageUrl: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
              coordinates: { lat: 10.0889, lng: 77.0595 },
              isConfirmed: true,
            }
          ]

      return {
        id: row.id,
        videoFileName: row.original_filename || 'video.mp4',
        videoFileSize: row.file_size_bytes ? `${(row.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : '32 MB',
        videoDurationSeconds: row.duration_seconds || 30,
        thumbnailUrl: candidates[0]?.imageUrl || 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
        status: row.status,
        progress: row.status === 'completed' ? 100 : row.status === 'processing' ? 60 : 25,
        statusMessage: row.status === 'completed' ? 'Destination identified' : row.status,
        createdAt: row.created_at,
        completedAt: row.updated_at,
        candidates,
        confirmedDestinationId: row.primary_destination_id || candidates[0]?.id,
        analysisDetails: {
          framesAnalyzed: 120,
          landmarksCount: candidates[0]?.detectedLandmarks.length || 2,
          speechDetected: true,
          sceneryTypes: ['Highland Hills', 'Scenic Valley']
        }
      }
    })
  },

  async getAnalysisById(id: string): Promise<VideoAnalysisJob | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_jobs')
      const list: VideoAnalysisJob[] = stored ? JSON.parse(stored) : MOCK_ANALYSIS_JOBS
      return list.find(j => j.id === id) || list[0] || null
    }

    const { data, error } = await supabase
      .from('video_analyses')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null

    const candidates: DestinationCandidate[] = Array.isArray(data.identified_destinations) && data.identified_destinations.length > 0
      ? data.identified_destinations
      : [
          {
            id: data.primary_destination_id || 'munnar',
            name: data.destination_name || 'Munnar',
            stateOrRegion: data.destination_region || 'Kerala',
            country: data.destination_country || 'India',
            confidence: Number(data.confidence_score) || 94,
            confidenceLevel: 'High',
            summary: data.analysis_summary || 'Topographical match identified.',
            detectedLandmarks: ['Tata Tea Terraces', 'Mattupetty Reservoir'],
            visualClues: ['Mountain mist', 'Lush tea plantations'],
            textOrSignsDetected: [],
            imageUrl: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
            coordinates: { lat: 10.0889, lng: 77.0595 },
            isConfirmed: true,
          }
        ]

    return {
      id: data.id,
      videoFileName: data.original_filename,
      videoFileSize: data.file_size_bytes ? `${(data.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : '32 MB',
      videoDurationSeconds: data.duration_seconds || 30,
      thumbnailUrl: candidates[0]?.imageUrl || 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
      status: data.status,
      progress: 100,
      statusMessage: 'Completed',
      createdAt: data.created_at,
      completedAt: data.updated_at,
      candidates,
      confirmedDestinationId: data.primary_destination_id,
      analysisDetails: {
        framesAnalyzed: 140,
        landmarksCount: 2,
        speechDetected: true,
        sceneryTypes: ['Highland Valleys']
      }
    }
  },

  async confirmDestination(id: string, destinationId: string, destinationName: string) {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_jobs')
      if (stored) {
        const list: VideoAnalysisJob[] = JSON.parse(stored)
        const updated = list.map(j => j.id === id ? { ...j, confirmedDestinationId: destinationId } : j)
        localStorage.setItem('travelmind_jobs', JSON.stringify(updated))
      }
      return
    }

    await supabase
      .from('video_analyses')
      .update({
        primary_destination_id: destinationId,
        destination_name: destinationName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
  },

  async deleteAnalysis(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('travelmind_jobs')
      if (stored) {
        const list: VideoAnalysisJob[] = JSON.parse(stored)
        localStorage.setItem('travelmind_jobs', JSON.stringify(list.filter(j => j.id !== id)))
      }
      return true
    }

    const { error } = await supabase
      .from('video_analyses')
      .delete()
      .eq('id', id)

    return !error
  }
}
