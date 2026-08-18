import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { getMyPosts, deletePost } from '../../api/posts'

const statusBadge = {
  PENDING: 'bg-warning text-dark',
  PUBLISHED: 'bg-success',
  REJECTED: 'bg-danger',
  REMOVED: 'bg-secondary',
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getMyPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return
    await deletePost(id)
    load()
  }

  return (
    <div className="bg-white border rounded p-3">
      <h4 className="fw-bold mb-3">User Profile</h4>
      <p className="mb-1">Name: {user.fullName || user.username}</p>
      <p className="mb-4">Email: {user.email}</p>

      <h5 className="fw-bold mb-3">Your Posts</h5>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-muted">You haven't written any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-light border rounded p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Your Blog Title: {post.title}</h6>
              <span className={`badge ${statusBadge[post.status] || 'bg-secondary'}`}>
                {post.status}
              </span>
            </div>
            <div className="d-flex gap-2">
              <Link to={`/posts/${post.id}/edit`} className="btn btn-secondary flex-fill">
                Edit
              </Link>
              <button className="btn btn-secondary flex-fill" onClick={() => handleDelete(post.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <button className="btn btn-dark w-100 mt-2" onClick={logout}>
        Logout
      </button>
    </div>
  )
}
