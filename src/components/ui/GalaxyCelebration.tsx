import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GalaxyCelebrationProps {
  onDismiss: () => void
}

// Pre-generate falling stars to avoid re-renders
const FALLING_STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  delay: Math.random() * 3,
  duration: 2.5 + Math.random() * 2.5,
  size: 10 + Math.random() * 16,
}))

// Grace period before allowing dismissal (seconds)
const DISMISS_GRACE_PERIOD = 4

export function GalaxyCelebration({ onDismiss }: GalaxyCelebrationProps) {
  const [canDismiss, setCanDismiss] = useState(false)

  // Enable dismissal after grace period
  useEffect(() => {
    const timer = setTimeout(() => setCanDismiss(true), DISMISS_GRACE_PERIOD * 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => canDismiss && onDismiss()}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Falling golden stars */}
      {FALLING_STARS.map((star) => (
        <motion.span
          key={star.id}
          className="absolute pointer-events-none"
          style={{ left: star.left, fontSize: star.size }}
          initial={{ opacity: 0, y: '-10vh' }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: '110vh',
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ⭐
        </motion.span>
      ))}

      {/* Darth Vader helmet — dramatic scale from center */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.05 }}
        animate={{ opacity: [0, 0.4, 0.3], scale: [0.05, 1.8, 1.5] }}
        transition={{ duration: 4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg
          viewBox="0 0 400 480"
          className="w-full h-full max-w-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Helmet outer shape */}
          <path
            d="M200 8
               C200 8 168 8 140 25 C108 45 78 80 60 125
               C44 165 35 210 34 250
               L28 258 C22 266 16 280 14 295
               C12 312 16 332 26 342 L38 348
               L40 375 C38 395 42 418 58 435
               C74 452 98 462 125 465
               L155 463 L175 466 L195 470 L200 472
               L205 470 L225 466 L245 463 L275 465
               C302 462 326 452 342 435
               C358 418 362 395 360 375 L362 348
               L374 342 C384 332 388 312 386 295
               C384 280 378 266 372 258 L366 250
               C365 210 356 165 340 125
               C322 80 292 45 260 25
               C232 8 200 8 200 8 Z"
            fill="white"
          />
          {/* Helmet center ridge */}
          <line x1="200" y1="8" x2="200" y2="160" stroke="black" strokeWidth="4" opacity="0.3" />
          {/* Forehead brow ridge */}
          <path d="M80 155 L200 140 L320 155 L200 148 Z" fill="black" opacity="0.2" />
          {/* Left eye — angular trapezoid */}
          <path d="M95 195 L190 175 L192 232 L88 255 Z" fill="black" />
          {/* Right eye — angular trapezoid */}
          <path d="M305 195 L210 175 L208 232 L312 255 Z" fill="black" />
          {/* Nose bridge */}
          <path d="M192 232 L208 232 L205 282 L195 282 Z" fill="black" />
          {/* Cheek lines */}
          <path d="M88 255 L50 265 L48 280 L85 272 Z" fill="black" opacity="0.3" />
          <path d="M312 255 L350 265 L352 280 L315 272 Z" fill="black" opacity="0.3" />
          {/* Mouth grille — triangular respirator */}
          <path d="M160 295 L240 295 L232 318 L168 318 Z" fill="black" />
          <path d="M168 328 L232 328 L225 350 L175 350 Z" fill="black" />
          <path d="M175 360 L225 360 L220 380 L180 380 Z" fill="black" />
          <path d="M182 390 L218 390 L214 406 L186 406 Z" fill="black" />
          <path d="M188 416 L212 416 L208 428 L192 428 Z" fill="black" />
          {/* Side panels / jaw lines */}
          <path d="M34 250 L14 295 L26 342 L38 348 L40 300 Z" fill="white" />
          <path d="M366 250 L386 295 L374 342 L362 348 L360 300 Z" fill="white" />
        </svg>
      </motion.div>

      {/* Golden radial burst (on top of Vader) */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.8, 1.4], opacity: [0, 0.9, 0.5] }}
        transition={{ duration: 2.5, delay: 0.5 }}
      />

      {/* Main content */}
      <motion.div className="text-center z-10 px-6">
        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gold mb-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
        >
          ¡MISIÓN CUMPLIDA!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl text-gold/80 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          ¡La galaxia es tuya!
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-base text-white/60 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Has conquistado todas las tablas de multiplicar
        </motion.p>

        {/* Stars row */}
        <motion.div
          className="flex justify-center gap-2 mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 1.4 + i * 0.15,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        {/* Continue button — only visible after grace period */}
        {canDismiss && (
          <motion.button
            onClick={onDismiss}
            className="mt-2 px-8 py-3 bg-gold/20 border-2 border-gold/60 text-gold rounded-full text-lg font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuar
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}
