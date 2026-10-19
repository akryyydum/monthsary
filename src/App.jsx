import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FXProvider, useFX } from './FX.jsx'
import Background from './Background.jsx'
import Intro from './Intro.jsx'
import MonthsaryWindow from './MonthsaryWindow.jsx'
import Gallery from './Gallery.jsx'
import { config } from './config.js'

function getSpotifyEmbedUrl(value) {
  if (!value) return null

  let url
  try {
    url = new URL(value)
  } catch {
    console.error('Invalid Spotify URL in config.spotifyEmbedUrl')
    return null
  }

  if (url.hostname !== 'open.spotify.com') {
    console.error('Spotify URL must use the open.spotify.com domain')
    return null
  }

  const parts = url.pathname.split('/').filter(Boolean)
  const typeIndex = parts[0] === 'embed' ? 1 : 0
  const type = parts[typeIndex]
  const id = parts[typeIndex + 1]
  const supportedTypes = ['album', 'episode', 'playlist', 'show', 'track']

  if (!supportedTypes.includes(type) || !id) {
    console.error('Spotify URL must point to a track, album, playlist, episode, or show')
    return null
  }

  return `https://open.spotify.com/embed/${type}/${id}`
}

function SpotifyPlayer() {
  const [hidden, setHidden] = useState(false)
  const [position, setPosition] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [returning, setReturning] = useState(false)
  const playerRef = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const returnTimer = useRef(null)
  useEffect(() => () => window.clearTimeout(returnTimer.current), [])

  const spotifyEmbedUrl = getSpotifyEmbedUrl(config.spotifyEmbedUrl)
  if (!spotifyEmbedUrl) return null

  const embedUrl = `${spotifyEmbedUrl}?utm_source=generator&theme=1&autoplay=1`

  const startDrag = (event) => {
    const player = playerRef.current
    if (!player) return

    const rect = player.getBoundingClientRect()
    dragOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    setPosition({ left: rect.left, top: rect.top })
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.stopPropagation()
  }

  const movePlayer = (event) => {
    if (!dragging) return

    const player = playerRef.current
    if (!player) return

    const maxLeft = window.innerWidth - player.offsetWidth
    const maxTop = window.innerHeight - player.offsetHeight
    setPosition({
      left: Math.max(0, Math.min(event.clientX - dragOffset.current.x, maxLeft)),
      top: Math.max(0, Math.min(event.clientY - dragOffset.current.y, maxTop)),
    })
  }

  const finishDrag = (event) => {
    if (!dragging) return

    const player = playerRef.current
    const isAtSide =
      player &&
      (player.getBoundingClientRect().left < 64 ||
        player.getBoundingClientRect().right > window.innerWidth - 64)

    setDragging(false)
    if (isAtSide) {
      setPosition(null)
      setHidden(true)
      return
    }

    const targetLeft = (window.innerWidth - player.offsetWidth) / 2
    const targetTop = window.innerHeight - player.offsetHeight - 14
    setReturning(true)
    setPosition({ left: targetLeft, top: targetTop })
    returnTimer.current = window.setTimeout(() => {
      setPosition(null)
      setReturning(false)
    }, 560)
  }

  if (hidden) {
    return (
      <button
        className="spotify-restore"
        type="button"
        onClick={() => {
          setReturning(true)
          setHidden(false)
          returnTimer.current = window.setTimeout(() => setReturning(false), 560)
        }}
        aria-label="Show Spotify player"
      >
        ♪
      </button>
    )
  }

  return (
    <div
      ref={playerRef}
      className={`spotify-player${dragging ? ' is-dragging' : ''}${returning ? ' is-returning' : ''}`}
      style={position ? { left: position.left, top: position.top, bottom: 'auto', transform: 'none' } : undefined}
      onPointerMove={movePlayer}
      onPointerUp={finishDrag}
      aria-label="Spotify music player"
    >
      <button
        className="spotify-drag-handle"
        type="button"
        onPointerDown={startDrag}
        onPointerMove={movePlayer}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        aria-label="Drag Spotify player"
      >
        <span aria-hidden="true">•••</span>
      </button>
      <iframe
        src={embedUrl}
        title="Spotify music player"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
}

function Stage() {
  const [stage, setStage] = useState('intro') // intro | window | gallery
  const [run, setRun] = useState(0)
  const [hasShot, setHasShot] = useState(false)
  const fx = useFX()

  return (
    <div
      className="app"
      onPointerDown={(e) => fx.burst(e.clientX, e.clientY, { count: 4, spread: 55 })}
    >
      <Background />
      {hasShot && <SpotifyPlayer />}
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key={`intro-${run}`}
            className="screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 0.4 }}
          >
            <Intro onDone={() => setStage('window')} onShot={() => setHasShot(true)} />
          </motion.div>
        )}

        {stage === 'window' && (
          <motion.div
            key="window"
            className="screen win-wrap"
            exit={{ opacity: 0, scale: 0.8, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <MonthsaryWindow onYes={() => setStage('gallery')} />
          </motion.div>
        )}

        {stage === 'gallery' && (
          <motion.div
            key="gallery"
            className="screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Gallery
              onReplay={() => {
                setRun((r) => r + 1)
                setStage('intro')
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <FXProvider>
      <Stage />
    </FXProvider>
  )
}
