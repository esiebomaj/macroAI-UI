import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

export default function AuthPage() {
  const { session, loading } = useAuth()
  const isMobile = useIsMobile()
  const mobileDensityClass = isMobile ? 'mobile-app-density' : ''
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <div className={`flex items-center justify-center min-h-screen text-muted text-sm font-mono ${mobileDensityClass}`}>Loading...</div>
  if (session) return <Navigate to="/app" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setInfo('')
    setBusy(true)
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setBusy(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/app' },
    })
    if (error) { setError(error.message); setBusy(false) }
  }

  return (
    <div className={`flex items-center justify-center min-h-screen px-4 ${mobileDensityClass}`} style={{ background: '#0e0e0e' }}>
      <div className="auth-card" style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <Link to="/">
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          Macro<span style={{ color: '#c8f066' }}>.</span>AI
        </div>
        </Link>

        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ fontSize: 13, color: '#666', marginBottom: '1.5rem' }}>
          Track your nutrition, hit your goals.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a', marginBottom: '1.5rem' }}>
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setInfo('') }}
              style={{
                padding: '8px 16px', fontSize: 13, cursor: 'pointer', border: 'none',
                background: 'none', color: mode === m ? 'white' : '#666',
                fontFamily: 'DM Sans, sans-serif',
                borderBottom: mode === m ? '2px solid #c8f066' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* Error / Info */}
        {error && (
          <div style={{ background: 'rgba(255,95,95,0.1)', border: '1px solid rgba(255,95,95,0.3)', color: '#ff5f5f', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 12 }}>
            {error}
          </div>
        )}
        {info && (
          <div style={{ background: 'rgba(200,240,102,0.1)', border: '1px solid rgba(200,240,102,0.3)', color: '#c8f066', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 12 }}>
            {info}
          </div>
        )}

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={busy}
          style={{
            width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #2a2a2a',
            background: '#1f1f1f', color: 'white', fontSize: 13, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', marginBottom: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            opacity: busy ? 0.5 : 1,
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
          <span style={{ fontSize: 11, color: '#666' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <input
              type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <button
            type="submit" disabled={busy}
            style={{
              width: '100%', padding: '11px', background: '#c8f066', color: '#0e0e0e',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500,
              cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
              opacity: busy ? 0.5 : 1,
            }}
          >
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
