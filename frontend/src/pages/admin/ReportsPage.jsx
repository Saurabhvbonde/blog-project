import { useState } from 'react'
import { getReport } from '../../api/admin'

const REPORT_TYPES = [
  { value: 'most-active-users', label: 'Most Active Users' },
  { value: 'most-popular-posts', label: 'Most Popular Posts' },
]

export default function ReportsPage() {
  const [type, setType] = useState(REPORT_TYPES[0].value)
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const data = await getReport(type)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  const valueLabel = type === 'most-active-users' ? 'Posts' : 'Views'

  return (
    <div className="bg-white border rounded p-3">
      <h4 className="fw-bold mb-3">Reports</h4>

      <label className="form-label fw-semibold">Select Report:</label>
      <select className="form-select mb-3" value={type} onChange={(e) => setType(e.target.value)}>
        {REPORT_TYPES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <button className="btn btn-dark w-100 mb-3" onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Report'}
      </button>

      {items && (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>{type === 'most-active-users' ? 'Username' : 'Post Title'}</th>
              <th>{valueLabel}</th>
            </tr>
          </thead>
          <tbody className="table-light">
            {items.map((item, idx) => (
              <tr key={item.label}>
                <td>{idx + 1}</td>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
