import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const q    = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4))
        const snap = await getDocs(q)
        setFeatured(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch { setFeatured([]) }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="hero__eyebrow">Tecnología de nicho</p>
            <h1 className="hero__title">Gadgets que<br />importan.</h1>
            <p className="hero__subtitle">Selección curada de tecnología para quienes saben lo que buscan.</p>
            <Link to="/productos" className="btn btn--primary">Ver catálogo</Link>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__block hero__block--dark">⌨️</div>
            <div className="hero__block hero__block--light">🎧</div>
            <div className="hero__block hero__block--mid">📱</div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="categories section-pad">
        <div className="container">
          <h2 className="section-title">Categorías</h2>
          <div className="categories__grid">
            {[
              { name: 'Audio', icon: '🎧', slug: 'Audio' },
              { name: 'Periféricos', icon: '⌨️', slug: 'Perifericos' },
              { name: 'Móviles', icon: '📱', slug: 'Moviles' },
              { name: 'Escritorio', icon: '🖥️', slug: 'Escritorio' },
            ].map(cat => (
              <Link key={cat.slug} to={`/productos?categoria=${cat.slug}`} className="cat-card">
                <span className="cat-card__icon">{cat.icon}</span>
                <span className="cat-card__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="featured section-pad">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Últimos productos</h2>
            <Link to="/productos" className="btn btn--ghost btn--sm">Ver todos →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <h3>Sin productos todavía</h3>
              <p>Agregá productos desde el panel de administración.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}