import api from './axios'

export const getFeed = (params) =>
  api.get('/posts', { params }).then((res) => res.data)

export const getMyPosts = () => api.get('/posts/mine').then((res) => res.data)

export const getPost = (id) => api.get(`/posts/${id}`).then((res) => res.data)

export const createPost = (payload) =>
  api.post('/posts', payload).then((res) => res.data)

export const updatePost = (id, payload) =>
  api.put(`/posts/${id}`, payload).then((res) => res.data)

export const deletePost = (id) => api.delete(`/posts/${id}`)
