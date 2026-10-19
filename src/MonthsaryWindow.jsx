import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Couple } from './Characters.jsx'
import { useFX } from './FX.jsx'
import { config } from './config.js'

const CLOSE_MESSAGES = [
  "Nope, you can't close this 😝",
  'Still no 💗',
  'Okay okay... just say yes 🥺',
]

function WaveTitle({ text }) {
  let n = 0
  return (
    <h1 className="wave" aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span className="word" key={w} aria-hidden="true">
          {[...word].map((ch) => {
            const i = n++
            return (
              <motion.span
                key={i}
                style={{ display: 'inline-block' }}
                initial={{ opacity: 0, y: 30, scale: 0.4 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 260, damping: 12 }}
              >
                <span className="ch" style={{ '--i': i }}>
                  {ch}
                </span>
              </motion.span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

export default function MonthsaryWindow({ onYes }) {
  const fx = useFX()
  const [showQ, setShowQ] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [closeTries, setCloseTries] = useState(0)
  const timers = useRef([])

  useEffect(() => {
    const t1 = setTimeout(() => {
      fx.burst(window.innerWidth / 2, window.innerHeight * 0.28, { count: 26, spread: 210 })
    }, 500)
    const t2 = setTimeout(() => setShowQ(true), 2200)
    timers.current.push(t1, t2)
    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const yes = (e) => {
    if (answered) return
    setAnswered(true)
    const r = e.currentTarget.getBoundingClientRect()
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 30, spread: 230 })
    timers.current.push(
      setTimeout(() => fx.burst(window.innerWidth / 2, window.innerHeight / 2, { count: 34, spread: 280 }), 500),
      setTimeout(onYes, 2300)
    )
  }

  const tryClose = () => setCloseTries((n) => n + 1)
  const closeMsg = closeTries > 0 ? CLOSE_MESSAGES[(closeTries - 1) % CLOSE_MESSAGES.length] : ''

  return (
    <motion.div
      className="win"
      initial={{ scale: 0.2, opacity: 0, y: 80, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 170, damping: 13 }}
    >
      <div className="win-bar">
        <div className="win-dots">
          <button className="dot dot-r" onClick={tryClose} aria-label="close" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
        </div>
        <span className="win-title">monthsary.exe 💗</span>
      </div>

      <div className="win-body">
        <Couple happy={answered} gifSlot="main" />

        {config.monthLabel && <span className="pill">{config.monthLabel}</span>}

        <WaveTitle text={config.title} />

        <motion.p
          className="sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {config.subtitle}
        </motion.p>

        <div className="q-area">
          <AnimatePresence mode="wait">
            {showQ && !answered && (
              <motion.div
                key="q"
                className="q-wrap"
                initial={{ opacity: 0, y: 24, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              >
                <div className="q-bubble">{config.question} 🥺</div>
                <div className="btn-row">
                  <motion.button
                    className="btn"
                    onClick={yes}
                    whileTap={{ scale: 0.92 }}
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    {config.yesButtons[0]}
                  </motion.button>
                  <motion.button
                    className="btn btn-alt"
                    onClick={yes}
                    whileTap={{ scale: 0.92 }}
                    animate={{ rotate: [2, -2, 2] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    {config.yesButtons[1]}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {answered && (
              <motion.div
                key="yay"
                className="yay"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                {config.yayText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {closeMsg && (
            <motion.p
              key={closeTries}
              className="toast"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {closeMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
