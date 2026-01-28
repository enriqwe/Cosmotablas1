import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { StarLevel } from '@/types/game.types'

interface CelebrationScreenProps {
  stars: StarLevel
  accuracy: number
  isFirstCompletion: boolean
  onContinue: () => void
}

const starMessages: Record<StarLevel, string> = {
  0: '¡Sigue practicando!',
  1: '¡Buen trabajo!',
  2: '¡Muy bien!',
  3: '¡Excelente!',
}

const starColors: Record<StarLevel, string> = {
  0: 'text-gray-400',
  1: 'text-amber-600',
  2: 'text-gray-300',
  3: 'text-yellow-400',
}

export function CelebrationScreen({
  stars,
  accuracy,
  isFirstCompletion,
  onContinue,
}: CelebrationScreenProps) {
  // Auto-advance after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onContinue])

  const renderStars = () => {
    const starElements = []
    for (let i = 1; i <= 3; i++) {
      const isEarned = i <= stars
      starElements.push(
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2 + i * 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className={`text-5xl ${isEarned ? starColors[stars] : 'text-gray-600'}`}
        >
          ★
        </motion.span>
      )
    }
    return starElements
  }

  return (
    <div className="min-h-screen bg-space-dark flex flex-col items-center justify-center p-6">
      {/* Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-8 text-center"
      >
        {isFirstCompletion ? '¡Planeta Conquistado!' : '¡Misión Completada!'}
      </motion.h1>

      {/* Animated Stars */}
      <motion.div
        className="flex gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {renderStars()}
      </motion.div>

      {/* Accuracy */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="text-6xl font-bold text-white mb-4"
      >
        {accuracy}%
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xl text-space-blue mb-8"
      >
        {starMessages[stars]}
      </motion.p>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={onContinue}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-space-blue text-white rounded-full text-lg font-semibold"
      >
        Continuar
      </motion.button>

      {/* New planet unlocked message */}
      {isFirstCompletion && stars > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-success text-center"
        >
          ¡Nuevo planeta desbloqueado!
        </motion.p>
      )}
    </div>
  )
}
