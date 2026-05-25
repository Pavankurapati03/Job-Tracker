import { useState, useEffect } from 'react'

const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected']

const EMPTY_FORM = {
  company: '',
  role: '',
  status: 'Applied',
  location: '',
  notes: '',
  applied_date: new Date().toISOString().split('T')[0],
}

export default function JobForm({ editingJob, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingJob) {
      setForm({
        company: editingJob.company || '',
        role: editingJob.role || '',
        status: editingJob.status || 'Applied',
        location: editingJob.location || '',
        notes: editingJob.notes || '',
        applied_date: editingJob.applied_date || EMPTY_FORM.applied_date,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editingJob])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingJob ? '✏️ Edit Job' : '➕ Add New Job'}</h2>
          <button id="close-modal-btn" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form id="job-form" onSubmit={handleSubmit} className="job-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <input
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Remote, Bangalore"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="applied_date">Applied Date</label>
            <input
              id="applied_date"
              name="applied_date"
              type="date"
              value={form.applied_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Recruiter name, referral, next steps..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button id="submit-job-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
