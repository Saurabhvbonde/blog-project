import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
  return (
    <div className="bg-light border rounded p-3 mb-3">
      <h5 className="mb-1">{post.title}</h5>
      <p className="text-muted small mb-2">
        Author: {post.author} | Date: {new Date(post.createdAt).toLocaleDateString()}
        {post.featured && <span className="badge bg-warning text-dark ms-2">Featured</span>}
      </p>
      <p className="excerpt mb-2">Excerpt: {post.excerpt}</p>
      <Link to={`/posts/${post.id}`} className="fw-semibold">
        Read More
      </Link>
    </div>
  )
}
