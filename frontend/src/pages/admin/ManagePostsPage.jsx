import { useEffect, useState } from 'react'
import { getAllPosts, toggleFeature, deletePostAdmin } from '../../api/admin'

const statusBadge = {
  PENDING: 'bg-warning text-dark',
  PUBLISHED: 'bg-success',
  REJECTED: 'bg-danger',
  REMOVED: 'bg-secondary',
}

export default function ManagePostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getAllPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleFeature = async (id) => {
    await toggleFeature(id)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return
    await deletePostAdmin(id)
    load()
  }

  return (
    <div className="bg-white border rounded p-3">
      <h4 className="fw-bold mb-3">Manage Blog Posts</h4>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-light">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    {post.title} {post.featured && <span className="badge bg-warning text-dark">Featured</span>}
                  </td>
                  <td>{post.author}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${statusBadge[post.status] || 'bg-secondary'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-dark btn-sm" onClick={() => handleFeature(post.id)}>
                        {post.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button className="btn btn-dark btn-sm" onClick={() => handleDelete(post.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
