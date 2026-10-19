import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Character, Couple } from './Characters.jsx'
import { config } from './config.js'

const modules = import.meta.glob('./photos/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const realPhotos = Object.keys(modules)
  .filter((k) => !Object.values(config.characterGifs).includes(k))
  .sort()
  .map((k) => modules[k])

const slides = realPhotos.length
  ? realPhotos.map((src, i) => ({ src, caption: config.captions[i] || '' }))
  : config.captions.map((caption, i) => ({ src: null, caption, kind: i % 2 ? 'bunny' : 'bear' }))

const TILTS = [-4, 3, -2, 4, -3, 2]

function Picture({ slide }) {
  if (slide.src) return <img src={slide.src} alt={slide.caption || 'us'} loading="lazy" draggable="false" />
  return (
    <div className="ph-empty">
      <Character kind={slide.kind} />
      <span>add your photo 📸</span>
    </div>
  )
}

function Lightbox({ index, onChange, onClose }) {
  const [dir, setDir] = useState(1)
  const go = (d) => {
    setDir(d)
    onChange((index + d + slides.length) % slides.length)
  }
  const s = slides[index]

  return (
    <motion.div
      className="lb"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className="lb-close" onClick={onClose} aria-label="close">
        ✕
      </button>

      <AnimatePresence initial={false} custom={dir} mode="wait">
        <motion.figure
          key={index}
          className="lb-card"
          custom={dir}
          variants={{
            enter: (d) => ({ x: d * 140, opacity: 0, rotate: d * 8, scale: 0.9 }),
            center: { x: 0, opacity: 1, rotate: 0, scale: 1 },
            exit: (d) => ({ x: -d * 140, opacity: 0, rotate: -d * 8, scale: 0.9 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, { offset, velocity }) => {
            if (offset.x < -80 || velocity.x < -500) go(1)
            else if (offset.x > 80 || velocity.x > 500) go(-1)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lb-photo">
            <Picture slide={s} />
          </div>
          <figcaption>{s.caption || '💗'}</figcaption>
        </motion.figure>
      </AnimatePresence>

      <div className="lb-nav" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => go(-1)} aria-label="previous">
          ‹
        </button>
        <span>
          {index + 1} / {slides.length}
        </span>
        <button onClick={() => go(1)} aria-label="next">
          ›
        </button>
      </div>
      <p className="lb-hint">swipe to browse</p>
    </motion.div>
  )
}

export default function Gallery({ onReplay }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="gal-root">
      <div className="gallery">
        <header className="g-head">
          <Couple small gifSlot="gallery" />
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 140, damping: 12 }}
          >
            {config.galleryTitle}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            {config.gallerySubtitle}
          </motion.p>
        </header>

        <div className="g-grid">
          {slides.map((s, i) => (
            <motion.button
              key={i}
              className="polaroid"
              initial={{ opacity: 0, y: 60, scale: 0.7, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: TILTS[i % TILTS.length] }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ type: 'spring', stiffness: 150, damping: 14, delay: (i % 2) * 0.12 }}
              whileTap={{ scale: 0.94, rotate: 0 }}
              onClick={() => setOpen(i)}
            >
              <span className="tape" />
              <div className="ph">
                <Picture slide={s} />
              </div>
              <span className="cap">{s.caption || '💗'}</span>
            </motion.button>
          ))}
        </div>

        <motion.section
          className="g-note"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
          <Couple small happy gifSlot="closing" />
          <p>{config.closingNote}</p>
        </motion.section>

        <button className="btn btn-replay" onClick={onReplay}>
          {config.replayLabel}
        </button>
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  )
}
