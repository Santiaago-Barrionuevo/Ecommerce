import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/'

  const [mode, setMode]       = useState('login')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
      navigate(next, { replace: true })
    } catch (err) {
      const msgs = {
        'auth/invalid-credential':    'Email o contraseña incorrectos.',
        'auth/email-already-in-use':  'Ese email ya está registrado.',
        'auth/weak-password':         'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-email':         'Email inválido.',
      }
      setError(msgs[err.code] || 'Ocurrió un error. Intentá de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Kova</h1>
        <p className="auth-subtitle">{mode === 'login' ? 'Ingresá a tu cuenta' : 'Creá tu cuenta'}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input className="input" type="password" value={password}
              onChange={e => setPass(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
          {' '}
          <button className="auth-switch__btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? 'Registrate' : 'Ingresá'}
          </button>
        </p>
      </div>
    </div>
  )
}