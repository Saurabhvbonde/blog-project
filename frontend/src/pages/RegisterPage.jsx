import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', fullName: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'ADMIN' ? '/admin/posts' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      setFieldErrors(err.response?.data?.fieldErrors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-4">
      <div className="auth-card bg-white border rounded shadow-sm p-4">
        <h4 className="mb-4 fw-bold">Registration</h4>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <div className="mb-3 text-start">
            <label className="form-label">Username:</label>
            <input
              className="form-control"
              value={form.username}
              onChange={update('username')}
              required
            />
            {fieldErrors.username && <div className="text-danger small">{fieldErrors.username}</div>}
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={update('password')}
              required
            />
            {fieldErrors.password && <div className="text-danger small">{fieldErrors.password}</div>}
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={update('email')}
              required
            />
            {fieldErrors.email && <div className="text-danger small">{fieldErrors.email}</div>}
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Full Name:</label>
            <input
              className="form-control"
              value={form.fullName}
              onChange={update('fullName')}
              required
            />
            {fieldErrors.fullName && <div className="text-danger small">{fieldErrors.fullName}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/login">Already have an account? Login here</Link>
        </div>
      </div>
    </div>
  )
}
