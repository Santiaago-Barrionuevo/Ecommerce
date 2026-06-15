import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kova_cart') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('kova_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
  }

  const removeItem  = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const updateQty   = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }
  const clearCart   = () => setItems([])
  const totalItems  = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice  = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}