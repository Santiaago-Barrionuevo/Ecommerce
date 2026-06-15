import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id))
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
        else navigate('/productos')
      } catch { navigate('/productos') }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (!product) return null

  const handleAdd = () => {
    addItem(product, qty)
    toast(`${product.name} agregado al carrito`)
  }

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn--ghost btn--sm detail-back" onClick={() => navigate(-1)}>← Volver</button>
        <div className="detail-grid">
          <div className="detail-img">
            <img src={product.image || 'https://placehold.co/600x600/f5f5f3/888?text=Kova'} alt={product.name} />
          </div>
          <div className="detail-info">
            <p className="detail-category">{product.category}</p>
            <h1 className="detail-title">{product.name}</h1>
            {product.badge && <span className={`badge badge--${product.badge}`}>{product.badge === 'new' ? 'Nuevo' : 'Oferta'}</span>}
            <p className="detail-price">${product.price?.toLocaleString()}</p>
            <p className="detail-desc">{product.description || 'Sin descripción disponible.'}</p>
            <div className="detail-actions">
              <div className="qty-control">
                <button className="btn btn--outline btn--sm" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-num">{qty}</span>
                <button className="btn btn--outline btn--sm" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button className="btn btn--primary" onClick={handleAdd}>Agregar al carrito</button>
            </div>
            {product.specs && (
              <div className="detail-specs">
                <h3>Especificaciones</h3>
                <ul>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <li key={k}><span>{k}</span><span>{v}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}