import { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useToast } from '../context/ToastContext'
import './Admin.css'

const EMPTY = { name: '', price: '', category: 'Audio', description: '', image: '', badge: '' }
const CATEGORIES = ['Audio', 'Perifericos', 'Moviles', 'Escritorio']

export default function Admin() {
  const { toast } = useToast()
  const [tab, setTab]         = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders]   = useState([])
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const loadProducts = async () => {
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')))
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const loadOrders = async () => {
    const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([loadProducts(), loadOrders()])
      setLoading(false)
    }
    load()
  }, [])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'products'), {
        ...form,
        price: Number(form.price),
        createdAt: serverTimestamp(),
      })
      toast('Producto agregado')
      setForm(EMPTY)
      await loadProducts()
    } catch { toast('Error al guardar') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteDoc(doc(db, 'products', id))
    toast('Producto eliminado')
    await loadProducts()
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="admin-title">Panel de administración</h1>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            Productos ({products.length})
          </button>
          <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            Pedidos ({orders.length})
          </button>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : tab === 'products' ? (
          <div className="admin-layout">
            {/* FORM */}
            <form onSubmit={handleAddProduct} className="admin-form">
              <h2>Agregar producto</h2>
              <div className="form-group">
                <label>Nombre</label>
                <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Sony WH-1000XM5" />
              </div>
              <div className="form-group">
                <label>Precio ($)</label>
                <input className="input" required type="number" min="1" value={form.price} onChange={e => set('price', e.target.value)} placeholder="89999" />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Breve descripción del producto..." />
              </div>
              <div className="form-group">
                <label>URL de imagen</label>
                <input className="input" type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Badge (opcional)</label>
                <select className="input" value={form.badge} onChange={e => set('badge', e.target.value)}>
                  <option value="">Sin badge</option>
                  <option value="new">Nuevo</option>
                  <option value="sale">Oferta</option>
                </select>
              </div>
              <button className="btn btn--primary btn--full" type="submit" disabled={saving}>
                {saving ? 'Guardando...' : 'Agregar producto'}
              </button>
            </form>

            {/* LISTA */}
            <div className="admin-list">
              <h2>Productos ({products.length})</h2>
              {products.length === 0 ? (
                <p className="admin-empty">No hay productos todavía.</p>
              ) : products.map(p => (
                <div key={p.id} className="admin-item">
                  <img src={p.image || 'https://placehold.co/56x56/f5f5f3/888?text=K'} alt={p.name} className="admin-item__img" />
                  <div className="admin-item__info">
                    <p className="admin-item__name">{p.name}</p>
                    <p className="admin-item__meta">{p.category} · ${Number(p.price).toLocaleString()}</p>
                  </div>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="orders-list">
            <h2>Pedidos</h2>
            {orders.length === 0 ? (
              <p className="admin-empty">No hay pedidos todavía.</p>
            ) : orders.map(o => (
              <div key={o.id} className="order-card">
                <div className="order-card__header">
                  <p className="order-card__id">#{o.id.slice(0, 8).toUpperCase()}</p>
                  <span className={`badge badge--new`}>{o.status}</span>
                  <p className="order-card__email">{o.email}</p>
                  <p className="order-card__total">${Number(o.total).toLocaleString()}</p>
                </div>
                <div className="order-card__items">
                  {o.items?.map((i, idx) => (
                    <span key={idx} className="order-card__item">{i.name} ×{i.qty}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}