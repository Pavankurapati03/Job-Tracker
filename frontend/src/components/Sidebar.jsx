import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Sidebar({ user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <aside className="sidebar">
      {/* Top: Logo */}
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="Job Tracker Logo" className="logo-img" />
          <div className="logo-text">
            <h1>Job Tracker</h1>
          </div>
        </Link>
      </div>

      {/* Middle: Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={`/${item.id}`}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-sidebar" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', minWidth: 0 }}>
          <div className="avatar" title={user?.username || 'User'} style={{ textTransform: 'uppercase', flexShrink: 0 }}>
            {user?.username ? user.username.slice(0, 1) : 'U'}
          </div>
          <div className="profile-info" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span className="profile-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '700', fontSize: '0.88rem' }}>
              {user?.username || 'Guest'}
            </span>
            <span className="profile-role" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || 'user@example.com'}
            </span>
          </div>
        </div>
        {onLogout && (
          <button
            id="logout-btn"
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm, 6px)',
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: 'var(--danger, #dc2626)',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fee2e2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  )
}
