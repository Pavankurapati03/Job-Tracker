import { useState } from 'react'

export default function EventFormModal({ jobs = [], onClose, onSubmit }) {
  const [jobId, setJobId] = useState('')
  const [type, setType] = useState('Interview')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!jobId) {
      alert('Please select a job application')
      return
    }
    setLoading(true)
    try {
      await onSubmit(jobId, {
        type,
        date,
        time: time || null,
        note: note || null,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2>Add Calendar Event</h2>
          <button id="close-event-modal-btn" className="modal-close" onClick={onClose}>×</button>
        </div>

        <form id="event-form" onSubmit={handleSubmit} className="job-form" style={{ padding: '20px 24px' }}>
          
          <div className="form-group">
            <label htmlFor="event-job">Select Job Application *</label>
            <select
              id="event-job"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              required
            >
              <option value="">— Select a Job —</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.company} — {job.role} ({job.status})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label htmlFor="event-type">Event Type *</label>
              <select
                id="event-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="Interview">Interview</option>
                <option value="Assessment">Assessment</option>
                <option value="Follow Up">Follow Up</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="event-time">Time</label>
              <input
                id="event-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label htmlFor="event-date">Date *</label>
            <input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label htmlFor="event-note">Note / Description</label>
            <textarea
              id="event-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Technical round, phone screening, follow-up email reminder..."
              rows={3}
            />
          </div>

          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="submit-event-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
