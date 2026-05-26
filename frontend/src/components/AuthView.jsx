import { useState } from 'react'
import logo from '../assets/logo.png'

export default function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // Import loginUser from API layer dynamically or call it directly
        const { loginUser } = await import('../api/jobsApi')
        const res = await loginUser({ username, password })
        const token = res.data.access_token
        onAuthSuccess(token)
      } else {
        const { registerUser } = await import('../api/jobsApi')
        const res = await registerUser({ username, email, password })
        const token = res.data.access_token
        onAuthSuccess(token)
      }
    } catch (err) {
      console.error(err)
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError("An unexpected authentication error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={styles.authContainer}>
      <div className="auth-card" style={styles.authCard}>
        {/* Logo and Greeting */}
        <div style={styles.headerArea}>
          <img src={logo} alt="Job Tracker Logo" style={styles.logoImg} />
          <h1 style={styles.title}>JobTracker</h1>
          <p style={styles.subtitle}>
            {isLogin ? 'Welcome back! Let\'s secure your dream job.' : 'Join us and track your career growth like a pro.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={styles.tabGroup}>
          <button
            style={{ ...styles.tabBtn, ...(isLogin ? styles.tabBtnActive : {}) }}
            onClick={() => !isLogin && toggleMode()}
          >
            Login
          </button>
          <button
            style={{ ...styles.tabBtn, ...(!isLogin ? styles.tabBtnActive : {}) }}
            onClick={() => isLogin && toggleMode()}
          >
            Register
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div style={styles.errorAlert}>
            {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="auth-username" style={styles.label}>Username or Email</label>
            <input
              id="auth-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="example or example@gmail.com"
              required
              style={styles.input}
            />
          </div>

          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="auth-email" style={styles.label}>Email Address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                required
                style={styles.input}
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="auth-password" style={styles.label}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ ...styles.input, paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#64748b',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="auth-confirm" style={styles.label}>Confirm Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="auth-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...styles.input, paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#64748b',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <span>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleMode} style={styles.linkBtn}>
              {isLogin ? 'Register now' : 'Sign in here'}
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

// Inline CSS for ultra-premium dark/light responsive layout
const styles = {
  authContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at top right, #f3e8ff, #ffffff, #eff6ff)',
    fontFamily: "'Inter', sans-serif",
    padding: '20px',
  },
  authCard: {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
    width: '100%',
    maxWidth: '430px',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },
  headerArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoImg: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '500',
    letterSpacing: '-0.03em',
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '0.88rem',
    color: '#64748b',
    lineHeight: '1.5',
    margin: 0,
  },
  tabGroup: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '24px',
  },
  tabBtn: {
    flex: 1,
    padding: '8px',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  },
  tabBtnActive: {
    background: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  errorAlert: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.825rem',
    fontWeight: '500',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#475569',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    background: '#ffffff',
    color: '#0f172a',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.85rem',
    color: '#64748b',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent, #2563eb)',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  }
}
