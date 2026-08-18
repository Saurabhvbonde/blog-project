import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPost, getPost, updatePost } from '../../api/posts'

export default function PostForm({ mode }) {
  const isEdit = mode === 'edit'
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', content: '', tags: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getPost(id)
        .then((post) => setForm({ title: post.title, content: post.content, tags: post.tags || '' }))
        .catch(() => setError('Failed to load post'))
        .finally(() => setLoading(false))
    }
  }, [isEdit, id])

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)
    try {
      if (isEdit) {
        await updatePost(id, form)
      } else {
        await createPost(form)
      }
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post')
      setFieldErrors(err.response?.data?.fieldErrors || {})
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>

  return (
    <div className="bg-white border rounded p-3">
      <h4 className="fw-bold mb-3">{isEdit ? 'Edit Post' : 'Create New Post'}</h4>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="mb-3">
          <label className="form-label fw-semibold">Title:</label>
          <input className="form-control" value={form.title} onChange={update('title')} required />
          {fieldErrors.title && <div className="text-danger small">{fieldErrors.title}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Content:</label>
          <textarea
            className="form-control"
            rows={8}
            value={form.content}
            onChange={update('content')}
            required
          />
          {fieldErrors.content && <div className="text-danger small">{fieldErrors.content}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Tags:</label>
          <input
            className="form-control"
            placeholder="Comma separated tags"
            value={form.tags}
            onChange={update('tags')}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish'}
        </button>
      </form>
    </div>
  )
}
