import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import './Checkout.css'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [orderId, setOrderId] = useState('')

  const [form, setForm] = useState({ nombre: '', apellido: '', direccion: '', ciudad: '', telefono: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const ref = await addDoc(collection(db, 'orders'), {
        userId:    user.uid,
        email:     user.email,
        items:     items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total:     totalPrice,
        shipping:  form,
        status:    'pendiente',
        createdAt: serverTimestamp(),
      })
      setOrderId(ref.id)
      clearCart()
      setDone(true)
    } catch { alert('Error al procesar el pedido. Intentá de nuevo.') }
    setLoading(false)
  }

  if (done) return (
    <div className="page">
      <div className="container">
        <div className="checkout-success">
          <div className="checkout-success__icon">✅</div>
          <h2>¡Pedido confirmado!</h2>
          <p>Tu número de orden es <strong>#{orderId.slice(0, 8).toUpperCase()}</strong></p>
          <p className="checkout-success__sub">Te contactaremos a <strong>{user.email}</strong> con los detalles del envío.</p>
          <button className="btn btn--primary" onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Datos de envío</h2>
            <div className="checkout-row">
              <div className="form-group">
                <label>Nombre</label>
                <input className="input" required value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Juan" />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input className="input" required value={form.apellido} onChange={e => set('apellido', e.target.value)} placeholder="Pérez" />
              </div>
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input className="input" required value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Av. Corrientes 1234" />
            </div>
            <div className="checkout-row">
              <div className="form-group">
                <label>Ciudad</label>
                <input className="input" required value={form.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="Buenos Aires" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input className="input" required value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+54 11 ..." />
              </div>
            </div>

            <h2 style={{ marginTop: 8 }}>Pago simulado</h2>
            <div className="fake-payment">
              <p>💳 Tarjeta de crédito/débito</p>
              <input className="input" placeholder="4242 4242 4242 4242" disabled />
              <div className="checkout-row">
                <input className="input" placeholder="MM/AA" disabled />
                <input className="input" placeholder="CVV" disabled />
              </div>
              <p className="fake-payment__note">* Pago simulado — no se procesa ningún cobro real.</p>
            </div>

            <button className="btn btn--primary btn--full" type="submit" disabled={loading || items.length === 0}>
              {loading ? 'Procesando...' : `Confirmar pedido · $${totalPrice.toLocaleString()}`}
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Tu pedido</h2>
            {items.map(i => (
              <div key={i.id} className="checkout-item">
                <span className="checkout-item__name">{i.name} <span className="checkout-item__qty">×{i.qty}</span></span>
                <span>${(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="checkout-total">
              <span>Total</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}