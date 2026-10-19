import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FXProvider, useFX } from './FX.jsx'
import Background from './Background.jsx'
import Intro from './Intro.jsx'
import MonthsaryWindow from './MonthsaryWindow.jsx'
import Gallery from './Gallery.jsx'

function Stage() {
  const [stage, setStage] = useState('intro') // intro | window | gallery
  const [run, setRun] = useState(0)
  const fx = useFX()

  return (
    <div
      className="app"
      onPointerDown={(e) => fx.burst(e.clientX, e.clientY, { count: 4, spread: 55 })}
    >
      <Background />
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
            <Intro onDone={() => setStage('window')} />
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
