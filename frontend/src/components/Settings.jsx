import { useState, useEffect } from 'react'
import { updateProfile, changePassword, deleteAccount } from '../api/jobsApi'
import { useToast } from '../context/ToastContext'

export default function Settings({ user, setUser, setToken, onLogout }) {
  const { success, error } = useToast()

  // ── Theme State ──
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  // ── Profile State ──
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [profilePassword, setProfilePassword] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  // ── Password State ──
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // ── Delete Account State ──
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Populate profile fields from user
  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setEmail(user.email || '')
    }
  }, [user])

  // Apply theme on mount & changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // ── Profile Update ──
  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!profilePassword) {
      error('Enter your current password to confirm changes')
      return
    }

    setProfileLoading(true)
    try {
      const res = await updateProfile({
        username: username.trim(),
        email: email.trim(),
        current_password: profilePassword
      })
      // Update token if username changed (new JWT issued)
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token)
        setToken(res.data.access_token)
      }
      if (res.data.user) {
        setUser(res.data.user)
      }
      success('Profile updated successfully!')
      setProfilePassword('')
    } catch (err) {
      error(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Password Change ──
  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      error('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      error('New passwords do not match')
      return
    }

    setPasswordLoading(true)
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword
      })
      success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      error(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  // ── Delete Account ──
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      error('Enter your password to confirm')
      return
    }

    setDeleteLoading(true)
    try {
      await deleteAccount({ current_password: deletePassword })
      // Account deleted — logout
      onLogout()
    } catch (err) {
      error(err.response?.data?.detail || 'Failed to delete account')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="settings-view">
      <div className="settings-page-header">
        <h2>Settings</h2>
        <p className="settings-subtitle">Manage your account, security, and preferences</p>
      </div>

      {/* ── Theme Toggle ── */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon">A</div>
          <div>
            <h3>Appearance</h3>
            <p className="settings-card-desc">Customize the look and feel of the app</p>
          </div>
        </div>
        <div className="settings-card-body">
          <div className="theme-toggle-row">
            <div className="theme-info">
              <span className="theme-label">Theme</span>
              <span className="theme-current">{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            </div>
            <button 
              className={`theme-switch ${theme === 'dark' ? 'theme-switch--active' : ''}`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="theme-switch-knob" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Profile ── */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon">P</div>
          <div>
            <h3>Profile</h3>
            <p className="settings-card-desc">Update your username and email address</p>
          </div>
        </div>
        <div className="settings-card-body">
          <form onSubmit={handleProfileUpdate} className="settings-form">
            <div className="settings-form-row">
              <div className="form-group">
                <label htmlFor="settings-username">Username</label>
                <input 
                  id="settings-username"
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="settings-email">Email</label>
                <input 
                  id="settings-email"
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="settings-profile-pw">Current Password <span className="required-star">*</span></label>
              <input 
                id="settings-profile-pw"
                type="password" 
                value={profilePassword} 
                onChange={e => setProfilePassword(e.target.value)}
                placeholder="Enter current password to confirm"
              />
            </div>
            <div className="settings-form-actions">
              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon">S</div>
          <div>
            <h3>Change Password</h3>
            <p className="settings-card-desc">Update your password to keep your account secure</p>
          </div>
        </div>
        <div className="settings-card-body">
          <form onSubmit={handlePasswordChange} className="settings-form">
            <div className="form-group">
              <label htmlFor="settings-cur-pw">Current Password</label>
              <input 
                id="settings-cur-pw"
                type="password" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="settings-form-row">
              <div className="form-group">
                <label htmlFor="settings-new-pw">New Password</label>
                <input 
                  id="settings-new-pw"
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="form-group">
                <label htmlFor="settings-confirm-pw">Confirm New Password</label>
                <input 
                  id="settings-confirm-pw"
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
            <div className="settings-form-actions">
              <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="settings-card settings-card--danger">
        <div className="settings-card-header">
          <div className="settings-card-icon danger-icon">!</div>
          <div>
            <h3>Danger Zone</h3>
            <p className="settings-card-desc">Irreversible actions — proceed with caution</p>
          </div>
        </div>
        <div className="settings-card-body">
          <div className="danger-zone-row">
            <div>
              <strong>Delete Account</strong>
              <p className="danger-desc">Permanently delete your account and all job data. This action cannot be undone.</p>
            </div>
            <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal--delete-account" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Account</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <div className="delete-modal-body">
              <div className="delete-warning-banner">
                <p><strong>This is permanent.</strong> All your data including jobs, events, and account information will be deleted forever.</p>
              </div>
              <div className="form-group">
                <label htmlFor="delete-pw">Enter your password to confirm</label>
                <input 
                  id="delete-pw"
                  type="password" 
                  value={deletePassword} 
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  autoFocus
                />
              </div>
              <div className="delete-modal-actions">
                <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setDeletePassword('') }}>
                  Cancel
                </button>
                <button className="btn btn-danger-solid" onClick={handleDeleteAccount} disabled={deleteLoading}>
                  {deleteLoading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
