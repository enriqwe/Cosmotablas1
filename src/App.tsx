import { useState, useCallback, lazy, Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SolarMap } from '@/features/solar-map/SolarMap'
import { GameSession } from '@/features/gameplay/GameSession'
import { StarCounter } from '@/components/layout/StarCounter'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Toast } from '@/components/ui/Toast'
import { Starfield } from '@/components/ui/Starfield'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StatisticsPanel } from '@/components/ui/StatisticsPanel'
import { StartScreen } from '@/features/start/StartScreen'
import { submitGlobalRecord } from '@/services/leaderboardApi'
import { calculatePoints } from '@/store/recordsStore'

// Lazy load non-critical components
const CelebrationScreen = lazy(() =>
  import('@/features/progression/CelebrationScreen').then((module) => ({
    default: module.CelebrationScreen,
  }))
)
import { useSessionStore } from '@/store/sessionStore'
import { useGameStore } from '@/store/gameStore'
import { useUserStore } from '@/store/userStore'
import { useRecordsStore, type RecordResult } from '@/store/recordsStore'
import { calculateStars } from '@/utils/starCalculator'
import { APP_NAME } from '@/constants/config'
import type { StarLevel, SessionResult } from '@/types/game.types'

type Screen = 'start' | 'map' | 'game' | 'celebration'

const avatarEmojis: Record<string, string> = {
  astronaut: '👨‍🚀',
  alien: '👽',
  robot: '🤖',
  rocket: '🚀',
  star: '⭐',
  planet: '🪐',
}

function getAvatarEmoji(avatar: string): string {
  return avatarEmojis[avatar] || '👤'
}

const initialSessionResult: SessionResult = {
  accuracy: 0,
  correctCount: 0,
  wrongCount: 0,
  totalTimeMs: 0,
  averageResponseTimeMs: 0,
}

function App() {
  const currentUserId = useUserStore((state) => state.currentUserId)
  const currentUser = useUserStore((state) => state.getCurrentUser())
  const logout = useUserStore((state) => state.logout)
  const setCurrentUser = useGameStore((state) => state.setCurrentUser)

  const [currentScreen, setCurrentScreen] = useState<Screen>(() =>
    currentUserId ? 'map' : 'start'
  )
  const [lastSessionResult, setLastSessionResult] = useState<SessionResult>(initialSessionResult)
  const [lastStars, setLastStars] = useState<StarLevel>(0)
  const [isFirstCompletion, setIsFirstCompletion] = useState<boolean>(false)
  const [activePlanetId, setActivePlanetId] = useState<number | null>(null)
  const [newlyUnlockedPlanetId, setNewlyUnlockedPlanetId] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [lastRecordResult, setLastRecordResult] = useState<RecordResult | null>(null)
  const [lastTableNumber, setLastTableNumber] = useState<number>(0)

  const startSession = useSessionStore((state) => state.startSession)
  const planets = useGameStore((state) => state.planets)
  const updatePlanetStars = useGameStore((state) => state.updatePlanetStars)
  const resetProgress = useGameStore((state) => state.resetProgress)
  const addRecord = useRecordsStore((state) => state.addRecord)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // Sync game progress when user changes
  useEffect(() => {
    setCurrentUser(currentUserId)
  }, [currentUserId, setCurrentUser])

  const handleStartGame = useCallback(() => {
    // Sync game progress immediately before transitioning
    // (don't rely solely on useEffect which fires after render)
    const userId = useUserStore.getState().currentUserId
    if (userId) {
      setCurrentUser(userId)
    }
    setCurrentScreen('map')
  }, [setCurrentUser])

  const handleLogout = useCallback(() => {
    logout()
    setCurrentScreen('start')
  }, [logout])

  const handlePlanetClick = useCallback((planetId: number) => {
    const planet = planets.find((p) => p.id === planetId)
    if (!planet) return

    if (planet.status === 'locked') {
      setToastMessage('🔒 ¡Completa el planeta anterior primero!')
      setTimeout(() => setToastMessage(null), 2500)
      return
    }

    // Track if this is first completion (planet not yet completed)
    setIsFirstCompletion(planet.status !== 'completed')
    setActivePlanetId(planetId)

    // Start session for unlocked or completed planets
    startSession(planetId, planet.table)
    setCurrentScreen('game')
  }, [planets, startSession])

  const handleSessionEnd = useCallback((result: SessionResult) => {
    const stars = calculateStars(result.accuracy)
    setLastSessionResult(result)
    setLastStars(stars)

    // Update game store with stars
    if (activePlanetId !== null) {
      updatePlanetStars(activePlanetId, stars, result.accuracy)

      // Track newly unlocked planet for animation (next planet if stars > 0 and first completion)
      if (stars > 0 && isFirstCompletion) {
        setNewlyUnlockedPlanetId(activePlanetId + 1)
      }

      // Add record if user is logged in
      const planet = planets.find((p) => p.id === activePlanetId)
      if (currentUserId && currentUser && planet) {
        const recordResult = addRecord(
          currentUserId,
          currentUser.name,
          planet.table,
          result.totalTimeMs,
          result.wrongCount
        )
        setLastRecordResult(recordResult)
        setLastTableNumber(planet.table)

        // Fire-and-forget: sync to global leaderboard
        submitGlobalRecord({
          userId: currentUserId,
          userName: currentUser.name,
          tableNumber: planet.table,
          timeMs: result.totalTimeMs,
          errors: result.wrongCount,
          points: calculatePoints(result.totalTimeMs, result.wrongCount),
        })
      } else {
        setLastRecordResult(null)
        setLastTableNumber(0)
      }
    }

    // Show celebration screen
    setCurrentScreen('celebration')
  }, [activePlanetId, updatePlanetStars, isFirstCompletion, planets, currentUserId, currentUser, addRecord])

  const handleCelebrationContinue = useCallback(() => {
    setActivePlanetId(null)
    setCurrentScreen('map')
    // Clear the animation flag after a delay to let the animation play (match spaceship flight duration)
    setTimeout(() => {
      setNewlyUnlockedPlanetId(null)
    }, 4000)
  }, [])

  const handleRetry = useCallback(() => {
    if (activePlanetId === null) return
    const planet = planets.find((p) => p.id === activePlanetId)
    if (!planet) return

    // Track if this would be first completion (check current status)
    setIsFirstCompletion(planet.status !== 'completed')
    // Restart session for the same planet
    startSession(activePlanetId, planet.table)
    setCurrentScreen('game')
  }, [activePlanetId, planets, startSession])

  const handleExit = useCallback(() => {
    setCurrentScreen('map')
  }, [])

  const handleResetConfirm = useCallback(() => {
    resetProgress()
    setShowResetConfirm(false)
    setToastMessage('Progreso reiniciado')
    setTimeout(() => setToastMessage(null), 2500)
  }, [resetProgress])

  return (
    <>
      {/* Animated starfield background */}
      <Starfield />

      {/* Toast notification */}
      <Toast message={toastMessage || ''} isVisible={!!toastMessage} />

      {/* Reset confirmation dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reiniciar Progreso"
        message="¿Estás seguro de que quieres reiniciar todo tu progreso? Perderás todas las estrellas conseguidas."
        confirmText="Reiniciar"
        cancelText="Cancelar"
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Statistics panel */}
      <StatisticsPanel
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      <AnimatePresence mode="wait">
        {currentScreen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StartScreen onStart={handleStartGame} />
          </motion.div>
        )}

        {currentScreen === 'map' && (
        <motion.div
          key="map"
          className="h-screen bg-space-dark text-white font-sans flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <motion.header
            className="p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* User info & logout */}
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-space-navy/50 rounded-full px-3 py-2 text-white/80 hover:text-white hover:bg-space-navy transition-colors"
              whileTap={{ scale: 0.95 }}
              title="Cambiar jugador"
            >
              <span className="text-lg">{currentUser ? getAvatarEmoji(currentUser.avatar) : '👤'}</span>
              <span className="text-sm font-medium max-w-20 truncate">{currentUser?.name || 'Jugador'}</span>
            </motion.button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gold">{APP_NAME}</h1>
            </div>
            <div className="flex gap-2">
              {/* Reset button */}
              <motion.button
                onClick={() => setShowResetConfirm(true)}
                className="w-10 h-10 bg-space-navy/50 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-space-navy transition-colors"
                whileTap={{ scale: 0.9 }}
                title="Reiniciar progreso"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.header>

          {/* Star Counter */}
          <StarCounter />

          {/* Main Content - Solar Map */}
          <SolarMap
            onPlanetClick={handlePlanetClick}
            onSunClick={() => setShowStats(true)}
            newlyUnlockedPlanetId={newlyUnlockedPlanetId}
          />
        </motion.div>
      )}

      {currentScreen === 'game' && (
        <motion.div
          key="game"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <GameSession
            onSessionEnd={handleSessionEnd}
            onExit={handleExit}
          />
        </motion.div>
      )}

      {currentScreen === 'celebration' && (
        <motion.div
          key="celebration"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <CelebrationScreen
              stars={lastStars}
              sessionResult={lastSessionResult}
              isFirstCompletion={isFirstCompletion}
              recordResult={lastRecordResult}
              tableNumber={lastTableNumber}
              onContinue={handleCelebrationContinue}
              onRetry={handleRetry}
            />
          </Suspense>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}

export default App
