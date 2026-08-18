import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole, deleteUser } from '../../api/admin'
import { useAuth } from '../../auth/AuthContext'

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN'
    await updateUserRole(u.id, newRole)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    await deleteUser(id)
    load()
  }

  return (
    <div className="bg-white border rounded p-3">
      <h4 className="fw-bold mb-3">Manage Users</h4>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark align-middle">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-light">
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-dark btn-sm" onClick={() => handleRoleToggle(u)}>
                        {u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                      </button>
                      <button
                        className="btn btn-dark btn-sm"
                        disabled={u.username === currentUser.username}
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No users found.
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
