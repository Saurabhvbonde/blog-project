import { useEffect, useState } from 'react'
import { getAllPosts, approvePost, rejectPost, removePost } from '../../api/admin'

export default function ModerationPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getAllPosts()
      .then((all) => setPosts(all.filter((p) => p.status === 'PENDING')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const act = (fn) => async (id) => {
    await fn(id)
    load()
  }

  const handleApprove = act(approvePost)
  const handleReject = act(rejectPost)
  const handleRemove = act(removePost)

  return (
    <div className="bg-white border rounded p-3">
      <h4 className="fw-bold mb-3">Post Moderation</h4>

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
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-warning text-dark">Pending Approval</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-dark btn-sm" onClick={() => handleApprove(post.id)}>
                        Approve
                      </button>
                      <button className="btn btn-dark btn-sm" onClick={() => handleReject(post.id)}>
                        Reject
                      </button>
                      <button className="btn btn-dark btn-sm" onClick={() => handleRemove(post.id)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No posts pending moderation.
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
