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
        {/* Rocket */}
        <motion.div
          className="text-7xl mb-6"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{
            scale: { type: 'spring', stiffness: 200, damping: 15 },
            rotate: { delay: 0.5, duration: 2, repeat: Infinity },
          }}
        >
          🚀
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
