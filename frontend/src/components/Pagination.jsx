export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="d-flex mb-3">
      <button
        className="btn btn-dark flex-fill rounded-0 me-1"
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        &laquo; Prev
      </button>
      <button
        className="btn btn-dark flex-fill rounded-0 ms-1"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next &raquo;
      </button>
    </div>
  )
}
