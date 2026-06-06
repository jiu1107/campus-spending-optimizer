import { useEffect } from 'react'

function Toast({ message, show, onClose, type = 'default' }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 2500)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const bgColor = {
    default: '#111827',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  }[type]

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: bgColor,
      color: 'white',
      padding: '10px 24px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      zIndex: 9999,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      animation: 'fadeIn 0.2s ease',
    }}>
      {message}
    </div>
  )
}

export default Toast
