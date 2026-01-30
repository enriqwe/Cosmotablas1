import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

interface FlyingRocketProps {
  isVisible: boolean
}

// Generate random star burst particles
function generateStarBurst(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + Math.random() * 20,
    distance: 100 + Math.random() * 80,
    size: Math.random() * 0.6 + 0.4,
    delay: Math.random() * 0.3,
    duration: 1.0 + Math.random() * 0.5,
  }))
}

// Generate trail particles
function generateTrailParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    offsetX: -10 - i * 8,
    offsetY: (Math.random() - 0.5) * 10,
    size: 1 - i * 0.15,
    delay: i * 0.05,
  }))
}

export function FlyingRocket({ isVisible }: FlyingRocketProps) {
  // Random starting position
  const startY = useMemo(() => Math.random() * 40 + 30, [])
  const starBurst = useMemo(() => generateStarBurst(12), [])
  const trailParticles = useMemo(() => generateTrailParticles(6), [])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Screen flash effect */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ backgroundColor: 'rgba(255, 215, 0, 0)' }}
            animate={{ backgroundColor: ['rgba(255, 215, 0, 0)', 'rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0)'] }}
            transition={{ duration: 0.4 }}
          />

          {/* Star burst from center */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-45">
            {starBurst.map((star) => (
              <motion.div
                key={star.id}
                className="absolute text-yellow-400"
                style={{ fontSize: `${star.size * 24}px` }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: Math.cos((star.angle * Math.PI) / 180) * star.distance,
                  y: Math.sin((star.angle * Math.PI) / 180) * star.distance,
                  opacity: [1, 1, 0],
                  scale: [0, 1.2, 0.5],
                }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  ease: 'easeOut',
                }}
              >
                ★
              </motion.div>
            ))}
          </div>

          {/* Main rocket */}
          <motion.div
            className="fixed pointer-events-none z-50"
            initial={{
              left: '-15%',
              top: `${startY}%`,
              rotate: -20,
              scale: 0.6,
            }}
            animate={{
              left: '115%',
              top: `${startY - 25}%`,
              rotate: 20,
              scale: [0.6, 1.4, 1.2],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* Rocket with glow */}
            <div className="relative">
              <motion.div
                className="text-5xl filter drop-shadow-lg"
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(255, 165, 0, 0.8))',
                    'drop-shadow(0 0 20px rgba(255, 165, 0, 1))',
                    'drop-shadow(0 0 10px rgba(255, 165, 0, 0.8))',
                  ],
                }}
                transition={{ duration: 0.3, repeat: 3 }}
              >
                🚀
              </motion.div>

              {/* Engine fire */}
              <motion.div
                className="absolute -left-6 top-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 0.15, repeat: 6 }}
              >
                <span className="text-3xl">🔥</span>
              </motion.div>

              {/* Sparkle trail */}
              {trailParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute top-1/2"
                  style={{
                    left: particle.offsetX,
                    transform: `translateY(${particle.offsetY}px)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, particle.size, 0],
                    scale: [0, particle.size, 0],
                  }}
                  transition={{
                    duration: 0.4,
                    delay: particle.delay,
                    repeat: 2,
                  }}
                >
                  <span className="text-xl text-yellow-300">✦</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Secondary comet (smaller, different path) */}
          <motion.div
            className="fixed pointer-events-none z-49"
            initial={{
              left: '-10%',
              top: `${startY + 15}%`,
              rotate: -10,
              scale: 0.4,
            }}
            animate={{
              left: '110%',
              top: `${startY - 10}%`,
              rotate: 10,
              scale: 0.7,
            }}
            transition={{
              duration: 1.6,
              delay: 0.2,
              ease: 'easeInOut',
            }}
          >
            <span className="text-3xl opacity-70">⭐</span>
          </motion.div>

          {/* Third element - shooting star */}
          <motion.div
            className="fixed pointer-events-none z-48"
            initial={{
              right: '120%',
              top: `${startY - 10}%`,
              rotate: 30,
            }}
            animate={{
              right: '-20%',
              top: `${startY + 20}%`,
              rotate: 30,
            }}
            transition={{
              duration: 1.4,
              delay: 0.4,
              ease: 'linear',
            }}
          >
            <span className="text-2xl opacity-50">💫</span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
