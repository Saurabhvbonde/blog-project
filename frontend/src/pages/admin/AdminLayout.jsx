import { Outlet } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const navItems = [
  { to: '/admin/posts', label: 'Manage Posts' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/moderation', label: 'Post Moderation' },
  { to: '/admin/reports', label: 'Reports' },
]

export default function AdminLayout() {
  return (
    <DashboardLayout title="Admin Blog Dashboard" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  )
}
