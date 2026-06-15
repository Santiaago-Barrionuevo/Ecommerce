import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import ProductCard from '../components/ProductCard'
import './Products.css'

const CATEGORIES = ['Todos', 'Audio', 'Perifericos', 'Moviles', 'Escritorio']

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('categoria') || 'Todos'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')))
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch { setProducts([]) }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = products.filter(p => {
    const matchCat    = activeCategory === 'Todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const setCategory = (cat) => {
    if (cat === 'Todos') setSearchParams({})
    else setSearchParams({ categoria: cat })
  }

  return (
    <div className="page">
      <div className="container">
        <div className="products-header">
          <h1 className="products-title">Catálogo</h1>
          <input
            className="input products-search"
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="products-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h3>Sin resultados</h3>
            <p>Probá con otro filtro o búsqueda.</p>
          </div>
        ) : (
          <>
            <p className="products-count">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}