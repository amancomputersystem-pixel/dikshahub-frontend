import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function NewPost() {
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const router = useRouter()

  async function uploadAndCreate(e) {
    e.preventDefault()

    if (!file) {
      alert('Please select an image or video')
      return
    }

    // Upload to Supabase Storage bucket "uploads"
    const filePath = `${Date.now()}_${file.name}`
    const { error: upErr } = await supabase.storage
      .from('uploads')
      .upload(filePath, file)

    if (upErr) {
      alert('Upload failed: ' + upErr.message)
      return
    }

    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    const mediaUrl = urlData.publicUrl

    // Insert into posts table
    const { error } = await supabase.from('posts').insert([
      {
        caption,
        media_url: mediaUrl,
        media_type: file.type
      }
    ])

    if (error) {
      alert('Database error: ' + error.message)
      return
    }

    router.push('/')
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h2>New Post</h2>

      <form onSubmit={uploadAndCreate}>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          style={{ width: '100%', marginBottom: 12, height: 80 }}
        />

        <input
          type="file"
          accept="image/*, video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          style={{
            marginTop: 12,
            padding: 10,
            width: '100%',
            background: '#222',
            color: '#fff',
            borderRadius: 6
          }}
        >
          Post
        </button>
      </form>
    </div>
  )
}
