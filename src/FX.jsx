import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const FXContext = createContext({ burst: () => {} })
export const useFX = () => useContext(FXContext)

const EMOJIS = ['💖', '💕', '✨', '💗', '🌸', '⭐', '🤍']

export function FXProvider({ children }) {
  const [items, setItems] = useState([])
  const idRef = useRef(0)

  const burst = useCallback((x, y, { count = 12, spread = 120, emojis = EMOJIS } = {}) => {
    const batch = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const dist = spread * (0.4 + Math.random() * 0.8)
      return {
        id: idRef.current++,
        x,
        y,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - spread * 0.4,
        rot: (Math.random() - 0.5) * 140,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: 14 + Math.random() * 16,
      }
    })
    const ids = new Set(batch.map((b) => b.id))
    setItems((p) => [...p, ...batch])
    setTimeout(() => setItems((p) => p.filter((i) => !ids.has(i.id))), 1500)
  }, [])

  const value = useMemo(() => ({ burst }), [burst])

  return (
    <FXContext.Provider value={value}>
      {children}
      <div className="fx-layer" aria-hidden="true">
        {items.map((i) => (
          <motion.span
            key={i.id}
            className="fx-item"
            style={{ left: i.x - i.size / 2, top: i.y - i.size / 2, fontSize: i.size }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.3, rotate: 0 }}
            animate={{ opacity: 0, x: i.dx, y: i.dy + 40, scale: 1.1, rotate: i.rot }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            {i.emoji}
          </motion.span>
        ))}
      </div>
    </FXContext.Provider>
  )
}
