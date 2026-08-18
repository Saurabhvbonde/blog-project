import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost } from '../../api/posts'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch(() => setError('Post not found'))
  }, [id])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!post) return <p className="text-muted">Loading...</p>

  return (
    <div className="bg-white border rounded p-4">
      <Link to="/" className="d-inline-block mb-3">
        &laquo; Back to posts
      </Link>
      <h3 className="fw-bold">{post.title}</h3>
      <p className="text-muted small">
        Author: {post.author} | Date: {new Date(post.createdAt).toLocaleDateString()}
        {post.tags && <span> | Tags: {post.tags}</span>}
      </p>
      <hr />
      <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
    </div>
  )
}
