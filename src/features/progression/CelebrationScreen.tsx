import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { StarLevel, SessionResult } from '@/types/game.types'
import { ParticleSystem } from '@/components/game/ParticleSystem'
import { useSoundContext } from '@/contexts/SoundContext'
import { useRecordsStore, type RecordResult } from '@/store/recordsStore'
import { useUserStore } from '@/store/userStore'

interface CelebrationScreenProps {
  stars: StarLevel
  sessionResult: SessionResult
  isFirstCompletion: boolean
  recordResult: RecordResult | null
  tableNumber: number
  onContinue: () => void
  onRetry: () => void
}

const starMessages: Record<StarLevel, string> = {
  0: '¡Sigue practicando!',
  1: '¡Completado!',
  2: '¡Buen trabajo!',
  3: '¡Muy bien!',
  4: '¡Excelente!',
  5: '¡¡PERFECTO!!',
}

const starColors: Record<StarLevel, string> = {
  0: 'text-gray-400',
  1: 'text-amber-600',
  2: 'text-gray-300',
  3: 'text-yellow-400',
  4: 'text-yellow-300',
  5: 'text-yellow-200',
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

function getMedal(position: number): string {
  switch (position) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return `${position}º`
  }
}

export function CelebrationScreen({
  stars,
  sessionResult,
  isFirstCompletion,
  recordResult,
  tableNumber,
  onContinue,
  onRetry,
}: CelebrationScreenProps) {
  const [showParticles, setShowParticles] = useState(stars > 0)
  const [showRecordBurst, setShowRecordBurst] = useState(false)
  const { playSound } = useSoundContext()
  const currentUserId = useUserStore((state) => state.currentUserId)
  const getAllRecordsByPoints = useRecordsStore((state) => state.getAllRecordsByPoints)

  const leaderboard = tableNumber > 0 ? getAllRecordsByPoints(tableNumber) : []

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

  // Trigger record burst after initial celebration
  useEffect(() => {
    if (recordResult?.isAbsoluteRecord) {
      const timer = setTimeout(() => setShowRecordBurst(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [recordResult])

  // Stop particles after duration
  useEffect(() => {
    if (showParticles) {
      const timer = setTimeout(() => setShowParticles(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showParticles])

  // Stop record burst after duration
  useEffect(() => {
    if (showRecordBurst) {
      const timer = setTimeout(() => setShowRecordBurst(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showRecordBurst])

  const renderStars = () => {
    const starElements = []
    for (let i = 1; i <= 5; i++) {
      const isEarned = i <= stars
      starElements.push(
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2 + i * 0.15,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className={`text-4xl ${isEarned ? starColors[stars] : 'text-gray-600'}`}
        >
          ★
        </motion.span>
      )
    }
    return starElements
  }

  return (
    <div className="min-h-screen bg-space-dark flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      {/* Particle celebration effect */}
      <ParticleSystem isActive={showParticles} duration={3000} />
      {/* Record burst effect */}
      <ParticleSystem isActive={showRecordBurst} duration={5000} intensity="record" />

      {/* Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-4 text-center"
      >
        {isFirstCompletion ? '¡Planeta Conquistado!' : '¡Misión Completada!'}
      </motion.h1>

      {/* Animated Stars */}
      <motion.div
        className="flex gap-4 mb-4"
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
        className="text-xl text-space-blue mb-4"
      >
        {starMessages[stars]}
      </motion.p>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-2 gap-3 mb-4 w-full max-w-xs"
      >
        {/* Total Time */}
        <div className="bg-space-navy rounded-lg p-3 text-center">
          <p className="text-white/60 text-xs mb-1">Tiempo total</p>
          <p className="text-white text-lg font-bold">
            {formatTime(sessionResult.totalTimeMs)}
          </p>
        </div>

        {/* Errors with penalty */}
        <div className="bg-space-navy rounded-lg p-3 text-center">
          <p className="text-white/60 text-xs mb-1">Fallos (+5s c/u)</p>
          <p className="text-warning text-lg font-bold">
            {sessionResult.wrongCount}
            {sessionResult.wrongCount > 0 && (
              <span className="text-white/40 text-sm font-normal"> (+{sessionResult.wrongCount * 5}s)</span>
            )}
          </p>
        </div>

        {/* Points */}
        {recordResult && (
          <div className="bg-space-navy rounded-lg p-3 text-center col-span-2 border border-gold/30">
            <p className="text-white/60 text-xs mb-1">Puntuación</p>
            <p className="text-gold text-2xl font-bold">
              {recordResult.points} pts
            </p>
            {recordResult.isNewPersonalBest && (
              <p className="text-yellow-400 text-xs mt-1">¡Mejor marca personal!</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Record Position */}
      {recordResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          className="mb-4 text-center"
        >
          {recordResult.isAbsoluteRecord ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <p className="text-3xl font-bold text-yellow-400">
                ★ ¡RÉCORD ABSOLUTO! ★
              </p>
              <p className="text-yellow-300/80 text-sm mt-1">
                ¡Eres el más rápido en la tabla del {tableNumber}!
              </p>
            </motion.div>
          ) : (
            <div>
              <p className="text-white text-lg">
                Posición: <span className="text-gold font-bold text-2xl">{getMedal(recordResult.position)}</span>
              </p>
              <p className="text-white/50 text-xs">
                de {recordResult.totalRecords} {recordResult.totalRecords === 1 ? 'jugador' : 'jugadores'}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Mini Leaderboard */}
      {recordResult && leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="w-full max-w-xs mb-4"
        >
          <p className="text-white/50 text-xs text-center mb-2">
            Ranking — Tabla del {tableNumber}
          </p>
          <div className="bg-space-navy rounded-xl p-3 space-y-1.5">
            {leaderboard.slice(0, 5).map((record, index) => {
              const isCurrentUser = record.userId === currentUserId
              return (
                <motion.div
                  key={record.userId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 ${
                    isCurrentUser ? 'bg-gold/15 border border-gold/30' : ''
                  }`}
                >
                  <span className="w-7 text-center shrink-0">{getMedal(index + 1)}</span>
                  <span className={`flex-1 truncate ${isCurrentUser ? 'text-gold font-semibold' : 'text-white/80'}`}>
                    {record.userName}
                    {isCurrentUser && ' (tú)'}
                  </span>
                  <span className={`font-mono text-xs ${isCurrentUser ? 'text-gold' : 'text-white/50'}`}>
                    {record.points} pts
                  </span>
                </motion.div>
              )
            })}
            {/* Show current user if outside top 5 */}
            {recordResult.position > 5 && (
              <>
                <div className="text-center text-white/30 text-xs">···</div>
                <div className="flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 bg-gold/15 border border-gold/30">
                  <span className="w-7 text-center shrink-0">{recordResult.position}º</span>
                  <span className="flex-1 truncate text-gold font-semibold">
                    {leaderboard.find((r) => r.userId === currentUserId)?.userName} (tú)
                  </span>
                  <span className="font-mono text-xs text-gold">
                    {recordResult.points} pts
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
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
          transition={{ delay: 1.8 }}
          className="mt-4 text-success text-center"
        >
          ¡Nuevo planeta desbloqueado!
        </motion.p>
      )}
    </div>
  )
}
