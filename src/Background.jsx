import { useMemo } from 'react'

const EMOJIS = ['💗', '💕', '✨', '🤍', '🌸', '⭐']

export default function Background() {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 20,
        dur: 10 + Math.random() * 10,
        delay: -Math.random() * 20,
        emoji: EMOJIS[i % EMOJIS.length],
      })),
    []
  )

  return (
    <div className="bg" aria-hidden="true">
      {items.map((i) => (
        <span
          key={i.id}
          style={{
            left: `${i.left}%`,
            fontSize: i.size,
            animationDuration: `${i.dur}s`,
            animationDelay: `${i.delay}s`,
          }}
        >
          {i.emoji}
        </span>
      ))}
    </div>
  )
}
