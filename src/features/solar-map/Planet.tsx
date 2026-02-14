import { motion } from 'framer-motion'
import type { Planet as PlanetType } from '@/types/game.types'

interface PlanetProps {
  planet: PlanetType
  onClick: () => void
  showUnlockAnimation?: boolean
  size?: 'small' | 'medium' | 'large'
}

// Planet visual configurations with gradients and textures
const planetConfigs: Record<number, {
  name: string
  baseGradient: string
  overlayGradient: string
  atmosphereColor: string
  features: string[]
}> = {
  2: {
    name: 'Mercurio',
    baseGradient: 'radial-gradient(circle at 30% 30%, #ff6b6b 0%, #c0392b 50%, #7f1d1d 100%)',
    overlayGradient: 'radial-gradient(ellipse at 40% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
    atmosphereColor: 'rgba(239, 68, 68, 0.4)',
    features: ['crater', 'ridge'],
  },
  3: {
    name: 'Venus',
    baseGradient: 'radial-gradient(circle at 35% 35%, #ffb347 0%, #f97316 40%, #c2410c 100%)',
    overlayGradient: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.4) 0%, transparent 40%)',
    atmosphereColor: 'rgba(249, 115, 22, 0.5)',
    features: ['clouds', 'swirl'],
  },
  4: {
    name: 'Tierra',
    baseGradient: 'radial-gradient(circle at 40% 40%, #fde047 0%, #eab308 50%, #a16207 100%)',
    overlayGradient: 'radial-gradient(ellipse at 25% 30%, rgba(255,255,255,0.35) 0%, transparent 45%)',
    atmosphereColor: 'rgba(234, 179, 8, 0.4)',
    features: ['continent', 'ocean'],
  },
  5: {
    name: 'Marte',
    baseGradient: 'radial-gradient(circle at 35% 35%, #4ade80 0%, #22c55e 45%, #166534 100%)',
    overlayGradient: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.3) 0%, transparent 50%)',
    atmosphereColor: 'rgba(34, 197, 94, 0.4)',
    features: ['forest', 'valley'],
  },
  6: {
    name: 'Júpiter',
    baseGradient: 'radial-gradient(circle at 40% 35%, #67e8f9 0%, #06b6d4 50%, #0e7490 100%)',
    overlayGradient: 'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.4) 0%, transparent 40%)',
    atmosphereColor: 'rgba(6, 182, 212, 0.5)',
    features: ['rings', 'storm'],
  },
  7: {
    name: 'Saturno',
    baseGradient: 'radial-gradient(circle at 35% 30%, #93c5fd 0%, #3b82f6 45%, #1e40af 100%)',
    overlayGradient: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.35) 0%, transparent 45%)',
    atmosphereColor: 'rgba(59, 130, 246, 0.5)',
    features: ['bands', 'rings'],
  },
  8: {
    name: 'Urano',
    baseGradient: 'radial-gradient(circle at 40% 35%, #c4b5fd 0%, #8b5cf6 50%, #6d28d9 100%)',
    overlayGradient: 'radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%)',
    atmosphereColor: 'rgba(139, 92, 246, 0.4)',
    features: ['mist', 'aurora'],
  },
  9: {
    name: 'Neptuno',
    baseGradient: 'radial-gradient(circle at 35% 35%, #f9a8d4 0%, #ec4899 45%, #be185d 100%)',
    overlayGradient: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 40%)',
    atmosphereColor: 'rgba(236, 72, 153, 0.4)',
    features: ['crystal', 'glow'],
  },
}

const sizeClasses = {
  small: 'w-14 h-14',
  medium: 'w-20 h-20',
  large: 'w-24 h-24',
}

const textSizes = {
  small: 'text-lg',
  medium: 'text-2xl',
  large: 'text-3xl',
}

export function Planet({ planet, onClick, showUnlockAnimation, size = 'medium' }: PlanetProps) {
  const isLocked = planet.status === 'locked'
  const isCompleted = planet.status === 'completed'
  const isUnlocked = planet.status === 'unlocked'

  const config = planetConfigs[planet.table] || planetConfigs[2]

  // Unlock animation variants
  const unlockVariants = {
    initial: { scale: 0.5, opacity: 0, rotate: -180 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      },
    },
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative ${sizeClasses[size]} rounded-full flex items-center justify-center
        transition-all duration-300 cursor-pointer
        ${isLocked ? 'grayscale cursor-not-allowed' : ''}
      `}
      whileHover={!isLocked ? { scale: 1.15 } : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : undefined}
      initial={showUnlockAnimation ? unlockVariants.initial : false}
      animate={showUnlockAnimation ? unlockVariants.animate : undefined}
    >
      {/* Planet base with gradient */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ background: config.baseGradient }}
      />

      {/* Planet texture overlay - veins/patterns */}
      <div
        className="absolute inset-0 rounded-full opacity-60"
        style={{
          background: `
            repeating-linear-gradient(
              ${45 + planet.table * 15}deg,
              transparent 0px,
              transparent 3px,
              rgba(255,255,255,0.1) 3px,
              rgba(255,255,255,0.1) 4px
            ),
            repeating-linear-gradient(
              ${-30 + planet.table * 10}deg,
              transparent 0px,
              transparent 5px,
              rgba(0,0,0,0.15) 5px,
              rgba(0,0,0,0.15) 6px
            )
          `,
        }}
      />

      {/* Spots/features */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Feature spot 1 */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: '30%',
            height: '25%',
            top: '20%',
            left: '15%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Feature spot 2 */}
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: '25%',
            height: '20%',
            top: '55%',
            left: '50%',
            background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)',
          }}
        />
        {/* Feature spot 3 - crater/lake */}
        <div
          className="absolute rounded-full opacity-25"
          style={{
            width: '20%',
            height: '15%',
            top: '35%',
            left: '60%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Highlight/shine overlay */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: config.overlayGradient }}
      />

      {/* Atmosphere glow for unlocked/completed */}
      {!isLocked && (
        <motion.div
          className="absolute -inset-1 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${config.atmosphereColor} 0%, transparent 70%)`,
          }}
          animate={
            isUnlocked
              ? {
                  scale: [1, 1.15, 1],
                  opacity: [0.6, 0.9, 0.6],
                }
              : isCompleted
                ? {
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }
                : undefined
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Gold ring for completed planets */}
      {isCompleted && (
        <motion.div
          className="absolute -inset-1 rounded-full border-2 border-gold/60 pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 10px rgba(255, 215, 0, 0.3)',
              '0 0 20px rgba(255, 215, 0, 0.5)',
              '0 0 10px rgba(255, 215, 0, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Planet number - styled */}
      <span
        className={`
          relative z-10 ${textSizes[size]} font-bold text-white
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
          ${isLocked ? 'opacity-40' : ''}
        `}
        style={{
          textShadow: '0 0 10px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {planet.table}
      </span>

      {/* Stars for completed planets - below the planet in 2 rows (3+2) */}
      {isCompleted && planet.stars > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center" style={{ bottom: size === 'small' ? '-1px' : size === 'medium' ? '-2px' : '-3px', lineHeight: 1, gap: 0 }}>
          {/* Top row: up to 3 stars */}
          <div className="flex" style={{ gap: 0, marginBottom: '-2px' }}>
            {Array.from({ length: Math.min(planet.stars, 3) }).map((_, i) => (
              <motion.span
                key={i}
                className="text-yellow-400 drop-shadow-[0_0_3px_rgba(255,215,0,0.8)]"
                style={{ fontSize: size === 'small' ? '7px' : size === 'medium' ? '8px' : '10px', lineHeight: 1 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.08, type: 'spring' }}
              >
                ★
              </motion.span>
            ))}
          </div>
          {/* Bottom row: stars 4 and 5 */}
          {planet.stars > 3 && (
            <div className="flex" style={{ gap: 0 }}>
              {Array.from({ length: planet.stars - 3 }).map((_, i) => (
                <motion.span
                  key={i + 3}
                  className="text-yellow-400 drop-shadow-[0_0_3px_rgba(255,215,0,0.8)]"
                  style={{ fontSize: size === 'small' ? '7px' : size === 'medium' ? '8px' : '10px', lineHeight: 1 }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: (i + 3) * 0.08, type: 'spring' }}
                >
                  ★
                </motion.span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lock overlay for locked planets */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full z-10">
          <span className="text-white/60 text-lg drop-shadow-lg">🔒</span>
        </div>
      )}
    </motion.button>
  )
}

// Export planet names for use in other components
export { planetConfigs }
