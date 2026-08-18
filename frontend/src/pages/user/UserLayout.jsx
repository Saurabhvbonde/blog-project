import { Outlet } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/posts/new', label: 'Create New Post' },
  { to: '/profile', label: 'Profile' },
]

export default function UserLayout() {
  return (
    <DashboardLayout title="Blog Dashboard" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  )
}
