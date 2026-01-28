import { motion } from 'framer-motion'
import type { Planet as PlanetType } from '@/types/game.types'

interface PlanetProps {
  planet: PlanetType
  onClick: () => void
}

const planetColors: Record<number, string> = {
  2: '#ef4444', // red
  3: '#f97316', // orange
  4: '#eab308', // yellow
  5: '#22c55e', // green
  6: '#06b6d4', // cyan
  7: '#3b82f6', // blue
  8: '#8b5cf6', // violet
  9: '#ec4899', // pink
}

export function Planet({ planet, onClick }: PlanetProps) {
  const isLocked = planet.status === 'locked'
  const isCompleted = planet.status === 'completed'
  const isUnlocked = planet.status === 'unlocked'

  const baseColor = planetColors[planet.table] || '#6b7280'

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative w-20 h-20 rounded-full flex items-center justify-center
        transition-all duration-300 cursor-pointer
        ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        ${isUnlocked ? 'shadow-lg shadow-space-blue/50' : ''}
        ${isCompleted ? 'shadow-lg shadow-gold/50' : ''}
      `}
      style={{ backgroundColor: baseColor }}
      whileHover={!isLocked ? { scale: 1.1 } : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : undefined}
      animate={isUnlocked ? {
        boxShadow: [
          '0 0 20px rgba(37, 99, 235, 0.5)',
          '0 0 40px rgba(37, 99, 235, 0.7)',
          '0 0 20px rgba(37, 99, 235, 0.5)',
        ]
      } : undefined}
      transition={isUnlocked ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      } : undefined}
    >
      {/* Planet number */}
      <span className="text-2xl font-bold text-white drop-shadow-lg">
        {planet.table}
      </span>

      {/* Stars for completed planets */}
      {isCompleted && planet.stars > 0 && (
        <div className="absolute -bottom-1 flex gap-0.5">
          {Array.from({ length: planet.stars }).map((_, i) => (
            <motion.span
              key={i}
              className="text-gold text-sm"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
            >
              ⭐
            </motion.span>
          ))}
        </div>
      )}

      {/* Lock icon for locked planets */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
          <span className="text-white/70 text-lg">🔒</span>
        </div>
      )}
    </motion.button>
  )
}
