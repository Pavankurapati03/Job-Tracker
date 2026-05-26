import StatsBar from './StatsBar'
import JobList from './JobList'

const STATUS_FILTERS = ['All', 'Applied', 'Interviewing', 'Offer', 'Rejected']

export default function Dashboard({
  user,
  jobs,
  filteredJobs,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onAdd,
  onEdit,
  onDelete,
  onPin,
  onView,
}) {
  return (
    <div className="dashboard-view">
      {/* Dynamic Welcoming Header */}
      <div className="dashboard-welcome-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>
          Welcome back, {user?.username || 'Guest'}! Here is your career search progress today.
        </p>
      </div>

      <StatsBar jobs={jobs} />

      {/* Toolbar: Add button + Status filters + Search */}
      <div className="toolbar">
        <div className="filter-tabs">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              className={`filter-tab ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="toolbar-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search by company/role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button id="add-job-btn" className="btn btn-primary" onClick={onAdd}>
            + Add Job
          </button>
        </div>
      </div>

      <div className="section-header">
        <h2>
          Applications <span className="count-badge">{filteredJobs.length}</span>
        </h2>
      </div>

      <JobList
        jobs={filteredJobs}
        onEdit={onEdit}
        onDelete={onDelete}
        onPin={onPin}
        onView={onView}
      />
    </div>
  )
}
