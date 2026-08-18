import api from './axios'

export const getAllPosts = () => api.get('/admin/posts').then((res) => res.data)
export const toggleFeature = (id) => api.put(`/admin/posts/${id}/feature`).then((res) => res.data)
export const deletePostAdmin = (id) => api.delete(`/admin/posts/${id}`)

export const approvePost = (id) => api.put(`/admin/posts/${id}/approve`).then((res) => res.data)
export const rejectPost = (id) => api.put(`/admin/posts/${id}/reject`).then((res) => res.data)
export const removePost = (id) => api.put(`/admin/posts/${id}/remove`).then((res) => res.data)

export const getAllUsers = () => api.get('/admin/users').then((res) => res.data)
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}`, { role }).then((res) => res.data)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)

export const getReport = (type) =>
  api.get('/admin/reports', { params: { type } }).then((res) => res.data)
