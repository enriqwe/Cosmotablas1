import { motion } from 'framer-motion'
import { useEffect } from 'react'

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

export function GalaxyCelebration({ onDismiss }: GalaxyCelebrationProps) {
  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 10000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onDismiss}
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

      {/* Golden radial burst */}
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
        {/* Darth Vader silhouette */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            scale: { type: 'spring', stiffness: 200, damping: 15 },
          }}
        >
          <motion.svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            className="drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            animate={{ filter: ['drop-shadow(0 0 10px rgba(251,191,36,0.3))', 'drop-shadow(0 0 25px rgba(251,191,36,0.6))', 'drop-shadow(0 0 10px rgba(251,191,36,0.3))'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M100 10 C55 10 25 50 25 90 C25 105 30 118 38 128 L38 150 C38 165 50 178 68 182 L68 190 L132 190 L132 182 C150 178 162 165 162 150 L162 128 C170 118 175 105 175 90 C175 50 145 10 100 10 Z
                 M60 80 C60 80 70 70 80 75 L80 90 L60 95 Z
                 M140 80 C140 80 130 70 120 75 L120 90 L140 95 Z
                 M80 110 L120 110 L115 118 L85 118 Z
                 M78 125 L122 125 L120 130 L80 130 Z
                 M82 135 L118 135 L116 140 L84 140 Z
                 M86 145 L114 145 L112 150 L88 150 Z"
              fill="rgba(255,255,255,0.9)"
              fillRule="evenodd"
            />
          </motion.svg>
        </motion.div>

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

        {/* Tap to continue */}
        <motion.p
          className="text-sm text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4, 0.8] }}
          transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
        >
          Toca para continuar
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
