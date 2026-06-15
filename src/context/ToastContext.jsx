import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()
export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, duration = 2500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
      </div>
    </ToastContext.Provider>
  )
}