import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardLayout({ title, navItems, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="bg-dark text-white py-3 position-relative text-center">
        <h4 className="mb-0">{title}</h4>
        {user && (
          <div className="position-absolute top-50 end-0 translate-middle-y me-3 d-flex align-items-center gap-2">
            <span className="small text-white-50 d-none d-sm-inline">{user.username}</span>
            <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <nav className="bg-secondary bg-opacity-75">
        <ul className="nav nav-pills-dark justify-content-center flex-column flex-md-row">
          {navItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  'nav-link text-center py-3 px-4' + (isActive ? ' active' : '')
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-grow-1 bg-white-subtle py-4" style={{ background: '#f4f3ec' }}>
        <div className="container">{children}</div>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        &copy; {new Date().getFullYear()} Blog Platform
      </footer>
    </div>
  )
}
