import { useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { useFX } from './FX.jsx'
import { config } from './config.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const STRING_PULLED = 'M12 62 L80 88 L148 62'
const STRING_STRAIGHT = 'M12 62 L80 63 L148 62'

function ArrowSVG() {
  return (
    <svg viewBox="0 0 24 120" width="22" height="120" aria-hidden="true">
      <rect x="10.5" y="20" width="3" height="88" rx="1.5" fill="#9b6a4f" />
      <path d="M12 0 L22 24 L12 18 L2 24 Z" fill="#f0477f" />
      <path d="M12 96 L2 116 L12 111 Z" fill="#ff9fbd" />
      <path d="M12 96 L22 116 L12 111 Z" fill="#ff9fbd" />
      <path d="M12 84 L3 102 L12 98 Z" fill="#ffc2d4" />
      <path d="M12 84 L21 102 L12 98 Z" fill="#ffc2d4" />
    </svg>
  )
}

export default function Intro({ onDone, onShot }) {
  const [phase, setPhase] = useState('idle') // idle | shooting | hit | opening
  const envRef = useRef(null)
  const arrowRef = useRef(null)
  const busy = useRef(false)
  const arrowCtl = useAnimationControls()
  const fx = useFX()

  const shoot = async () => {
    if (busy.current) return
    busy.current = true
    setPhase('shooting')

    const e = envRef.current.getBoundingClientRect()
    const a = arrowRef.current.getBoundingClientRect()
    const cx = e.left + e.width / 2
    const cy = e.top + e.height / 2
    const dx = cx - (a.left + a.width / 2)
    const dy = cy - a.top

    await arrowCtl.start({
      x: dx,
      y: dy,
      transition: { duration: 0.6, ease: [0.15, 0.8, 0.25, 1] },
    })

    setPhase('hit')
    onShot?.()
    fx.burst(cx, cy, { count: 18, spread: 150 })
    await sleep(800)

    setPhase('opening')
    arrowCtl.start({ opacity: 0, scale: 0.6, transition: { duration: 0.5 } })
    fx.burst(cx, cy - 20, { count: 22, spread: 190 })
    await sleep(1500)

    onDone()
  }

  return (
    <div
      className={`intro ${phase !== 'idle' ? 'shot' : ''}`}
      onClick={shoot}
      role="button"
      aria-label={config.tapHint}
    >
      <motion.h1
        className="intro-title"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      >
        {config.introTitle} <span className="wiggle-emoji">💌</span>
        <small>somebody has a surprise for you</small>
      </motion.h1>

      <div className="env-stage">
        <div className="env-float">
          <div
            ref={envRef}
            className={`env ${phase === 'hit' ? 'is-hit' : ''} ${phase === 'opening' ? 'is-open' : ''}`}
          >
            <div className="env-back" />
            <div className="env-letter">
              <span className="letter-emoji">💗</span>
            </div>
            <div className="env-front" />
            <div className="env-flap">
              <span className="env-seal">💗</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bow-area">
        <div className="bow-wrap">
          <motion.div
            ref={arrowRef}
            className="arrow"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={arrowCtl}
          >
            <div className="arrow-inner">
              <ArrowSVG />
            </div>
          </motion.div>
          <svg className="bow" viewBox="0 0 160 100" aria-hidden="true">
            <path
              d="M12 62 Q80 -2 148 62"
              fill="none"
              stroke="#f0477f"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <motion.path
              d={STRING_PULLED}
              animate={{ d: [STRING_PULLED, phase === 'idle' ? STRING_PULLED : STRING_STRAIGHT] }}
              transition={{ duration: 0.12 }}
              fill="none"
              stroke="#9b6a4f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <motion.p
          className="tap-hint"
          animate={phase === 'idle' ? { scale: [1, 1.08, 1], opacity: 1 } : { opacity: 0 }}
          transition={phase === 'idle' ? { duration: 1.3, repeat: Infinity } : { duration: 0.3 }}
        >
          👆 {config.tapHint}
        </motion.p>
      </div>
    </div>
  )
}
