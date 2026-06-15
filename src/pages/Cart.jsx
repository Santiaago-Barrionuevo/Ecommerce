import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

export default function Cart() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <div className="empty-state__icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Explorá el catálogo y encontrá algo que te guste.</p>
          <Link to="/productos" className="btn btn--primary" style={{ marginTop: 20, display: 'inline-flex' }}>Ver productos</Link>
        </div>
      </div>
    </div>
  )

  const handleCheckout = () => {
    if (!user) { navigate('/login?next=/checkout'); return }
    navigate('/checkout')
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="cart-title">Carrito</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image || 'https://placehold.co/80x80/f5f5f3/888?text=K'}
                  alt={item.name}
                  className="cart-item__img"
                />
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__price">${item.price?.toLocaleString()}</p>
                </div>
                <div className="cart-item__qty">
                  <button className="btn btn--outline btn--sm" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button className="btn btn--outline btn--sm" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <p className="cart-item__subtotal">${(item.price * item.qty).toLocaleString()}</p>
                <button className="btn btn--ghost btn--sm" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumen</h2>
            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="cart-summary__row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="cart-summary__row cart-summary__total">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn btn--primary btn--full" onClick={handleCheckout}>
              Ir al checkout
            </button>
            <button className="btn btn--ghost btn--sm" onClick={clearCart} style={{ marginTop: 8, width: '100%' }}>
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}