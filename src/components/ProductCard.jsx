import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { toast }   = useToast()

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product)
    toast(`${product.name} agregado al carrito`)
  }

  return (
    <Link to={`/productos/${product.id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img src={product.image || 'https://placehold.co/400x400/f5f5f3/888?text=Kova'} alt={product.name} />
        {product.badge && <span className={`badge badge--${product.badge}`}>{product.badge === 'new' ? 'Nuevo' : 'Oferta'}</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__footer">
          <span className="product-card__price">${product.price.toLocaleString()}</span>
          <button className="btn btn--primary btn--sm" onClick={handleAdd}>+ Agregar</button>
        </div>
      </div>
    </Link>
  )
}