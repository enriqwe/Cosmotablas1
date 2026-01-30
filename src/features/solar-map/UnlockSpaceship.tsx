import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface OrbitalConfig {
  orbitRadius: number
  angle: number
  planetSize: string
}

interface UnlockSpaceshipProps {
  fromPlanetIndex: number
  toPlanetIndex: number
  orbitalConfigs: OrbitalConfig[]
  centerX: number
  centerY: number
}

export function UnlockSpaceship({
  fromPlanetIndex,
  toPlanetIndex,
  orbitalConfigs,
  centerX,
  centerY,
}: UnlockSpaceshipProps) {
  const fromConfig = orbitalConfigs[fromPlanetIndex]
  const toConfig = orbitalConfigs[toPlanetIndex]

  // Calculate start and end positions
  const positions = useMemo(() => {
    if (!fromConfig || !toConfig) return null

    const fromAngleRad = (fromConfig.angle * Math.PI) / 180
    const toAngleRad = (toConfig.angle * Math.PI) / 180

    const startX = centerX + Math.cos(fromAngleRad) * fromConfig.orbitRadius
    const startY = centerY + Math.sin(fromAngleRad) * fromConfig.orbitRadius
    const endX = centerX + Math.cos(toAngleRad) * toConfig.orbitRadius
    const endY = centerY + Math.sin(toAngleRad) * toConfig.orbitRadius

    // Calculate angle for rocket rotation
    const deltaX = endX - startX
    const deltaY = endY - startY
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

    // Calculate midpoint for curved path (arc through space)
    const midRadius = (fromConfig.orbitRadius + toConfig.orbitRadius) / 2 + 50
    const midAngle = (fromConfig.angle + toConfig.angle) / 2
    const midAngleRad = (midAngle * Math.PI) / 180
    const midX = centerX + Math.cos(midAngleRad) * midRadius
    const midY = centerY + Math.sin(midAngleRad) * midRadius

    return { startX, startY, endX, endY, midX, midY, angle }
  }, [fromConfig, toConfig, centerX, centerY])

  if (!positions) return null

  // Generate trail particles
  const trailParticles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        delay: i * 0.06,
        size: 1 - i * 0.08,
      })),
    []
  )

  // Animation duration (slower for better visibility)
  const FLIGHT_DURATION = 3.5

  return (
    <>
      {/* Spaceship following curved path */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        initial={{
          left: positions.startX - 20,
          top: positions.startY - 20,
          scale: 0,
          opacity: 0,
        }}
        animate={{
          left: [positions.startX - 20, positions.midX - 20, positions.endX - 20],
          top: [positions.startY - 20, positions.midY - 20, positions.endY - 20],
          scale: [0, 1.5, 1.2, 1],
          opacity: [0, 1, 1, 1, 0],
          rotate: [positions.angle - 30, positions.angle, positions.angle + 30],
        }}
        transition={{
          duration: FLIGHT_DURATION,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        }}
      >
        {/* Rocket with glow */}
        <motion.div
          className="relative"
          animate={{
            filter: [
              'drop-shadow(0 0 10px rgba(255, 200, 0, 0.6))',
              'drop-shadow(0 0 25px rgba(255, 200, 0, 1))',
              'drop-shadow(0 0 10px rgba(255, 200, 0, 0.6))',
            ],
          }}
          transition={{ duration: 0.2, repeat: 10 }}
        >
          <span className="text-4xl">🚀</span>
        </motion.div>

        {/* Engine fire */}
        <motion.div
          className="absolute -left-6 top-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 0.1, repeat: 20 }}
        >
          <span className="text-2xl">🔥</span>
        </motion.div>

        {/* Sparkle trail */}
        {trailParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: -10 - particle.id * 8 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, particle.size * 0.9, 0],
              scale: [0, particle.size, 0],
            }}
            transition={{
              duration: 0.3,
              delay: particle.delay,
              repeat: 6,
            }}
          >
            <span className="text-yellow-300" style={{ fontSize: `${14 * particle.size}px` }}>
              ✦
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Departure burst from source planet */}
      <motion.div
        className="absolute z-40 pointer-events-none"
        style={{
          left: positions.startX,
          top: positions.startY,
        }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-3 h-3 bg-yellow-400 rounded-full"
            style={{
              left: -6,
              top: -6,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 0,
            }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * 50,
              y: Math.sin((angle * Math.PI) / 180) * 50,
              opacity: [1, 0.8, 0],
              scale: [0, 1.2, 0.5],
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
        {/* Central flash */}
        <motion.div
          className="absolute w-16 h-16 rounded-full"
          style={{
            left: -32,
            top: -32,
            background: 'radial-gradient(circle, rgba(255,255,100,0.8) 0%, transparent 70%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Arrival burst at destination planet */}
      <motion.div
        className="absolute z-40 pointer-events-none"
        style={{
          left: positions.endX,
          top: positions.endY,
        }}
      >
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <motion.div
            key={angle}
            className="absolute"
            style={{
              left: 0,
              top: 0,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * 60,
              y: Math.sin((angle * Math.PI) / 180) * 60,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0.5],
            }}
            transition={{
              duration: 1,
              delay: FLIGHT_DURATION - 0.3,
              ease: 'easeOut',
            }}
          >
            <span className="text-yellow-300 text-2xl">✨</span>
          </motion.div>
        ))}

        {/* Landing flash */}
        <motion.div
          className="absolute w-24 h-24 rounded-full"
          style={{
            left: -48,
            top: -48,
            background: 'radial-gradient(circle, rgba(100,200,255,0.6) 0%, transparent 70%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2.5, 0],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 0.7,
            delay: FLIGHT_DURATION - 0.2,
          }}
        />
      </motion.div>

      {/* Trail path visualization */}
      <svg
        className="absolute inset-0 pointer-events-none z-30"
        style={{ width: '100%', height: '100%' }}
      >
        <motion.path
          d={`M ${positions.startX} ${positions.startY} Q ${positions.midX} ${positions.midY} ${positions.endX} ${positions.endY}`}
          fill="none"
          stroke="rgba(255, 200, 100, 0.3)"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{ duration: FLIGHT_DURATION, ease: 'easeInOut' }}
        />
      </svg>
    </>
  )
}
