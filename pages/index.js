import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      setPosts(data || [])
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <Head>
        <title>DikshaHub</title>
      </Head>
      <h1 style={{ textAlign: 'center' }}>DikshaHub — Feed</h1>
      <div>
        {posts.length === 0 && <p>No posts yet. Use /post/new to add.</p>}
        {posts.map(p => (
          <div key={p.id} style={{
            border: '1px solid #eee',
            padding: 12,
            marginTop: 12,
            borderRadius: 8
          }}>
            <div style={{ fontWeight: 600 }}>{p.caption}</div>
            {p.media_url && (
              <img
                src={p.media_url}
                style={{ width: '100%', marginTop: 8, borderRadius: 6 }}
                alt="post"
              />
            )}
            <div style={{ color: '#666', marginTop: 6 }}>
              {new Date(p.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
