import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">Kova</Link>

        <div className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/productos" onClick={() => setMenuOpen(false)}>Productos</Link>
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
        </div>

        <div className="navbar__actions">
          <Link to="/carrito" className="navbar__cart" aria-label="Carrito">
            🛒
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          {user ? (
            <button className="btn btn--outline btn--sm" onClick={handleLogout}>Salir</button>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm">Ingresar</Link>
          )}
          <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}