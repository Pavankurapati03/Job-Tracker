import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import CalendarView from './components/CalendarView'
import Settings from './components/Settings'
import JobForm from './components/JobForm'
import JobDetails from './components/JobDetails'
import EventFormModal from './components/EventFormModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import AuthView from './components/AuthView'
import { getJobs, createJob, updateJob, deleteJob, addJobEvent, deleteJobEvent, getCurrentProfile } from './api/jobsApi'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'
import EventReminder from './components/EventReminder'
import './App.css'

// Initialize theme from localStorage before React renders
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

export default function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [viewingJob, setViewingJob] = useState(null)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [error, setError] = useState(null)
  
  // Dashboard states
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchJobs = async () => {
    if (!token) return
    try {
      const res = await getJobs()
      setJobs(res.data)
      setError(null)
    } catch {
      setError('Cannot connect to backend. Make sure FastAPI is running on port 8000.')
    }
  }

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getCurrentProfile()
          setUser(res.data)
          const jobsRes = await getJobs()
          setJobs(jobsRes.data)
        } catch (err) {
          console.error("Token verification failed, logging out...", err)
          handleLogout()
        }
      }
      setLoadingUser(false)
    }
    initAuth()

    const handleUnauthorized = () => {
      console.warn("Unauthorized token detected via API interceptor. Logging out.")
      handleLogout()
    }
    
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [token])

  const handleAuthSuccess = async (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setJobs([])
    navigate('/login')
  }

  const handleAdd = () => {
    setEditingJob(null)
    setShowForm(true)
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingJob(null)
  }

  const handleSubmit = async (formData) => {
    if (editingJob) {
      await updateJob(editingJob.id, formData)
    } else {
      await createJob(formData)
    }
    await fetchJobs()
    handleClose()
  }

  const handleDelete = async (id) => {
    setJobToDelete(id)
  }

  const confirmDelete = async () => {
    if (jobToDelete) {
      await deleteJob(jobToDelete)
      await fetchJobs()
      setJobToDelete(null)
    }
  }

  const handlePin = async (job) => {
    await updateJob(job.id, { pinned: !job.pinned })
    await fetchJobs()
  }

  const handleView = (job) => setViewingJob(job)

  const handleAddEvent = async (jobId, eventData) => {
    try {
      await addJobEvent(jobId, eventData)
      await fetchJobs()
      
      if (viewingJob && viewingJob.id === jobId) {
        const updatedJobs = await getJobs()
        const latestJob = updatedJobs.data.find(j => j.id === jobId)
        if (latestJob) {
          setViewingJob(latestJob)
        }
      }
      setShowEventForm(false)
    } catch (err) {
      console.error("Failed to add event", err)
      setError("Failed to add event. Please try again.")
    }
  }

  const handleDeleteEvent = async (jobId, eventId) => {
    try {
      const res = await deleteJobEvent(jobId, eventId)
      await fetchJobs()
      
      if (viewingJob && viewingJob.id === jobId) {
        setViewingJob(res.data)
      }
    } catch (err) {
      console.error("Failed to delete event", err)
      setError("Failed to delete event. Please try again.")
    }
  }

  // Filter then sort: pinned first, then by applied_date desc
  const filteredJobs = jobs
    .filter((j) => statusFilter === 'All' || j.status === statusFilter)
    .filter((j) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      const companyMatch = j.company && j.company.toLowerCase().includes(q)
      const roleMatch = j.role && j.role.toLowerCase().includes(q)
      return companyMatch || roleMatch
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.applied_date) - new Date(a.applied_date)
    })

  // Loading page spinner
  if (loadingUser) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #f3e8ff, #ffffff, #eff6ff)',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</div>
          <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#64748b' }}>Loading JobTracker...</div>
        </div>
      </div>
    )
  }

  // Auth Protection Route (If not logged in, block other views and redirect to login)
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<AuthView onAuthSuccess={handleAuthSuccess} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
    <ToastProvider>
      <div className="app-layout">
        <Sidebar 
          user={user}
          onLogout={handleLogout}
        />

        <main className="app-main-content">
          <EventReminder jobs={jobs} />
          {error && <div className="error-banner">{error}</div>}

        <Routes>
          <Route path="/dashboard" element={
            <Dashboard 
              user={user}
              jobs={jobs}
              filteredJobs={filteredJobs}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPin={handlePin}
              onView={handleView}
            />
          } />
          
          <Route path="/calendar" element={
            <CalendarView 
              jobs={filteredJobs} 
              onView={handleView} 
              onAddEvent={() => setShowEventForm(true)} 
            />
          } />
          
          <Route path="/settings" element={
            <Settings 
              user={user}
              setUser={setUser}
              setToken={setToken}
              onLogout={handleLogout}
            />
          } />

          {/* Fallbacks */}
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>

      {showForm && (
        <JobForm
          editingJob={editingJob}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {showEventForm && (
        <EventFormModal
          jobs={jobs}
          onClose={() => setShowEventForm(false)}
          onSubmit={handleAddEvent}
        />
      )}

      {viewingJob && (
        <JobDetails
          job={viewingJob}
          onClose={() => setViewingJob(null)}
          onEdit={(job) => { setViewingJob(null); handleEdit(job) }}
          onDeleteEvent={handleDeleteEvent}
        />
      )}

        {jobToDelete && (
          <DeleteConfirmModal
            onClose={() => setJobToDelete(null)}
            onConfirm={confirmDelete}
          />
        )}
        
        <ToastContainer />
      </div>
    </ToastProvider>
  )
}
