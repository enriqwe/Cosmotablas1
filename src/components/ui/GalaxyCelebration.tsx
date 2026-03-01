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

      {/* Giant Darth Vader silhouette — background presence rising from below */}
      <motion.svg
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{ transform: 'translateX(-50%)' }}
        width="120%"
        viewBox="0 0 500 700"
        preserveAspectRatio="xMidYMax meet"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: [0, 0.12, 0.08], y: [80, 0, 0] }}
        transition={{ duration: 3, delay: 0.3, ease: 'easeOut' }}
      >
        {/* Helmet dome */}
        <path
          d="M250 40 C140 40 60 130 60 240 C60 280 70 315 88 340
             L88 420 C88 470 130 510 185 520 L185 580 L150 580 L120 700
             L380 700 L350 580 L315 580 L315 520 C370 510 412 470 412 420
             L412 340 C430 315 440 280 440 240 C440 130 360 40 250 40 Z"
          fill="white"
        />
        {/* Left eye triangle */}
        <path
          d="M155 210 C155 210 185 185 215 195 L215 235 L155 250 Z"
          fill="black"
        />
        {/* Right eye triangle */}
        <path
          d="M345 210 C345 210 315 185 285 195 L285 235 L345 250 Z"
          fill="black"
        />
        {/* Nose ridge */}
        <path
          d="M235 250 L265 250 L260 290 L240 290 Z"
          fill="black"
        />
        {/* Mouth grille lines */}
        <path d="M195 310 L305 310 L298 325 L202 325 Z" fill="black" />
        <path d="M200 335 L300 335 L295 348 L205 348 Z" fill="black" />
        <path d="M208 358 L292 358 L288 370 L212 370 Z" fill="black" />
        <path d="M215 380 L285 380 L282 390 L218 390 Z" fill="black" />
        {/* Helmet side vents */}
        <path d="M88 280 L60 270 L55 300 L88 310 Z" fill="white" />
        <path d="M412 280 L440 270 L445 300 L412 310 Z" fill="white" />
        {/* Chest panel */}
        <path
          d="M200 530 L300 530 L310 620 L190 620 Z"
          fill="black"
        />
        <rect x="210" y="545" width="30" height="12" rx="2" fill="#333" />
        <rect x="210" y="565" width="30" height="12" rx="2" fill="#333" />
        <rect x="260" y="545" width="30" height="12" rx="2" fill="#333" />
        <rect x="260" y="565" width="30" height="12" rx="2" fill="#333" />
      </motion.svg>

      {/* Golden radial burst (on top of Vader) */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0.4] }}
        transition={{ duration: 2, delay: 0.2 }}
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
