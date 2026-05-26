import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle expired tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 Unauthorized, the token is invalid/expired
      localStorage.removeItem('token');
      // Dispatch a custom event so App.jsx can handle state cleanly, 
      // or fallback to window.location redirect
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error)
  }
)

// Auth API Calls
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getCurrentProfile = () => api.get('/auth/me')
export const updateProfile = (data) => api.put('/auth/profile', data)
export const changePassword = (data) => api.put('/auth/password', data)
export const deleteAccount = (data) => api.delete('/auth/account', { data })

// Jobs API Calls
export const getJobs = () => api.get('/jobs')
export const getJob = (id) => api.get(`/jobs/${id}`)
export const createJob = (data) => api.post('/jobs', data)
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data)
export const deleteJob = (id) => api.delete(`/jobs/${id}`)
export const addJobEvent = (jobId, eventData) => api.post(`/jobs/${jobId}/events`, eventData)
export const deleteJobEvent = (jobId, eventId) => api.delete(`/jobs/${jobId}/events/${eventId}`)
