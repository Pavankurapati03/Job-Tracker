import JobCard from './JobCard'

export default function JobList({ jobs, onEdit, onDelete, onPin, onView }) {
  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <h3>No applications yet</h3>
        <p>Click <strong>Add Job</strong> to log your first application.</p>
      </div>
    )
  }

  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onPin={onPin}
          onView={onView}
        />
      ))}
    </div>
  )
}
