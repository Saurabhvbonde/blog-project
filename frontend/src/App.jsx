import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './auth/ProtectedRoute'
import AdminRoute from './auth/AdminRoute'

import UserLayout from './pages/user/UserLayout'
import HomePage from './pages/user/HomePage'
import PostDetailPage from './pages/user/PostDetailPage'
import PostForm from './pages/user/PostForm'
import ProfilePage from './pages/user/ProfilePage'

import AdminLayout from './pages/admin/AdminLayout'
import ManagePostsPage from './pages/admin/ManagePostsPage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import ModerationPage from './pages/admin/ModerationPage'
import ReportsPage from './pages/admin/ReportsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/new" element={<PostForm mode="create" />} />
          <Route path="/posts/:id/edit" element={<PostForm mode="edit" />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/posts" element={<ManagePostsPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/moderation" element={<ModerationPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
