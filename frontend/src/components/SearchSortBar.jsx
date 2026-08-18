export default function SearchSortBar({ search, onSearchChange, sort, onSortChange }) {
  return (
    <>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="form-select mb-3"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="date">Sort by Date</option>
        <option value="popularity">Sort by Popularity</option>
        <option value="author">Sort by Author</option>
      </select>
    </>
  )
}
