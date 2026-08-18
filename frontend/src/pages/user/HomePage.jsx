import { useEffect, useState } from 'react'
import { getFeed } from '../../api/posts'
import PostCard from '../../components/PostCard'
import Pagination from '../../components/Pagination'
import SearchSortBar from '../../components/SearchSortBar'

const PAGE_SIZE = 5

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('date')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      getFeed({ search, sort, page, size: PAGE_SIZE })
        .then(setData)
        .catch(() => setError('Failed to load posts'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, sort, page])

  useEffect(() => {
    setPage(0)
  }, [search, sort])

  return (
    <div className="bg-white border rounded p-3">
      <h4 className="fw-bold mb-3">Blog Posts</h4>

      <SearchSortBar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : data.content.length === 0 ? (
        <p className="text-muted">No posts found.</p>
      ) : (
        data.content.map((post) => <PostCard key={post.id} post={post} />)
      )}

      <Pagination page={data.page ?? page} totalPages={data.totalPages ?? 0} onChange={setPage} />
    </div>
  )
}
