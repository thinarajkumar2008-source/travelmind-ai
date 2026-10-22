import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const storageService = {
  /**
   * Uploads a video file into private 'travel-videos' bucket under the user's isolated folder:
   * path: {userId}/{videoId}_{cleanFilename}
   */
  async uploadVideo(
    userId: string, 
    file: File, 
    onProgress?: (progress: number, status: string) => void
  ): Promise<{ path: string | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      onProgress?.(30, 'Simulating secure object upload...')
      await new Promise(r => setTimeout(r, 400))
      return { path: `local_dev/${userId}/${file.name}`, error: null }
    }

    try {
      const videoId = Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6)
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `${userId}/${videoId}_${cleanName}`

      onProgress?.(25, 'Uploading video to secure private storage...')

      const { data, error } = await supabase.storage
        .from('travel-videos')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Supabase storage upload error:', error)
        return { path: null, error: error.message }
      }

      onProgress?.(50, 'Video uploaded securely. Initializing analysis...')
      return { path: data?.path || storagePath, error: null }
    } catch (err: any) {
      return { path: null, error: err?.message || 'Storage upload failed' }
    }
  },

  /**
   * Generates a temporary signed URL for a private video object
   */
  async getSignedUrl(path: string, expiresInSeconds: number = 3600): Promise<string | null> {
    if (!isSupabaseConfigured || path.startsWith('local_dev/')) {
      return null
    }

    const { data, error } = await supabase.storage
      .from('travel-videos')
      .createSignedUrl(path, expiresInSeconds)

    if (error) {
      console.warn('Could not generate signed URL:', error.message)
      return null
    }
    return data.signedUrl
  },

  /**
   * Deletes a user's uploaded video file from storage
   */
  async deleteVideo(path: string): Promise<boolean> {
    if (!isSupabaseConfigured || path.startsWith('local_dev/')) {
      return true
    }

    const { error } = await supabase.storage
      .from('travel-videos')
      .remove([path])

    return !error
  }
}
