import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { StarLevel, SessionResult } from '@/types/game.types'
import { ParticleSystem } from '@/components/game/ParticleSystem'
import { useSoundContext } from '@/contexts/SoundContext'

interface CelebrationScreenProps {
  stars: StarLevel
  sessionResult: SessionResult
  isFirstCompletion: boolean
  onContinue: () => void
  onRetry: () => void
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

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

function formatAverageTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(1)}s`
}

export function CelebrationScreen({
  stars,
  sessionResult,
  isFirstCompletion,
  onContinue,
  onRetry,
}: CelebrationScreenProps) {
  const [showParticles, setShowParticles] = useState(stars > 0)
  const { playSound } = useSoundContext()

  // Play celebration sound on mount
  useEffect(() => {
    if (stars > 0) {
      playSound('celebration')
      // Play unlock sound if new planet unlocked
      if (isFirstCompletion) {
        setTimeout(() => playSound('unlock'), 500)
      }
    }
  }, [stars, isFirstCompletion, playSound])

  // Stop particles after duration
  useEffect(() => {
    if (showParticles) {
      const timer = setTimeout(() => setShowParticles(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showParticles])

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
    <div className="min-h-screen bg-space-dark flex flex-col items-center justify-center p-6 relative">
      {/* Particle celebration effect */}
      <ParticleSystem isActive={showParticles} duration={3000} />

      {/* Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-6 text-center"
      >
        {isFirstCompletion ? '¡Planeta Conquistado!' : '¡Misión Completada!'}
      </motion.h1>

      {/* Animated Stars */}
      <motion.div
        className="flex gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {renderStars()}
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xl text-space-blue mb-6"
      >
        {starMessages[stars]}
      </motion.p>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs"
      >
        {/* Total Time */}
        <div className="bg-space-navy rounded-lg p-4 text-center">
          <p className="text-white/60 text-sm mb-1">Tiempo total</p>
          <p className="text-white text-xl font-bold">
            {formatTime(sessionResult.totalTimeMs)}
          </p>
        </div>

        {/* Average Response */}
        <div className="bg-space-navy rounded-lg p-4 text-center">
          <p className="text-white/60 text-sm mb-1">Velocidad media</p>
          <p className="text-white text-xl font-bold">
            {formatAverageTime(sessionResult.averageResponseTimeMs)}
          </p>
        </div>

        {/* Correct */}
        <div className="bg-space-navy rounded-lg p-4 text-center">
          <p className="text-white/60 text-sm mb-1">Aciertos</p>
          <p className="text-success text-xl font-bold">
            {sessionResult.correctCount}
          </p>
        </div>

        {/* Wrong */}
        <div className="bg-space-navy rounded-lg p-4 text-center">
          <p className="text-white/60 text-sm mb-1">Fallos</p>
          <p className="text-warning text-xl font-bold">
            {sessionResult.wrongCount}
          </p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex gap-4"
      >
        {/* Retry button */}
        <motion.button
          onClick={onRetry}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-space-navy text-white rounded-full text-lg font-semibold border-2 border-space-purple/50 hover:bg-space-purple/20 transition-colors"
        >
          Reintentar
        </motion.button>

        {/* Continue button */}
        <motion.button
          onClick={onContinue}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-space-blue text-white rounded-full text-lg font-semibold"
        >
          Continuar
        </motion.button>
      </motion.div>

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
