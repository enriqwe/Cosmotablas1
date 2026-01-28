import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SolarMap } from '@/features/solar-map/SolarMap'
import { GameSession } from '@/features/gameplay/GameSession'
import { CelebrationScreen } from '@/features/progression/CelebrationScreen'
import { StarCounter } from '@/components/layout/StarCounter'
import { useSessionStore } from '@/store/sessionStore'
import { useGameStore } from '@/store/gameStore'
import { calculateStars } from '@/utils/starCalculator'
import { APP_NAME } from '@/constants/config'
import type { StarLevel } from '@/types/game.types'

type Screen = 'map' | 'game' | 'celebration'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map')
  const [lastAccuracy, setLastAccuracy] = useState<number>(0)
  const [lastStars, setLastStars] = useState<StarLevel>(0)
  const [isFirstCompletion, setIsFirstCompletion] = useState<boolean>(false)
  const [activePlanetId, setActivePlanetId] = useState<number | null>(null)
  const [newlyUnlockedPlanetId, setNewlyUnlockedPlanetId] = useState<number | null>(null)

  const startSession = useSessionStore((state) => state.startSession)
  const planets = useGameStore((state) => state.planets)
  const updatePlanetStars = useGameStore((state) => state.updatePlanetStars)

  const handlePlanetClick = useCallback((planetId: number) => {
    const planet = planets.find((p) => p.id === planetId)
    if (!planet) return

    if (planet.status === 'locked') {
      alert('¡Completa el planeta anterior primero!')
      return
    }

    // Track if this is first completion (planet not yet completed)
    setIsFirstCompletion(planet.status !== 'completed')
    setActivePlanetId(planetId)

    // Start session for unlocked or completed planets
    startSession(planetId, planet.table)
    setCurrentScreen('game')
  }, [planets, startSession])

  const handleSessionEnd = useCallback((accuracy: number) => {
    const stars = calculateStars(accuracy)
    setLastAccuracy(accuracy)
    setLastStars(stars)

    // Update game store with stars
    if (activePlanetId !== null) {
      updatePlanetStars(activePlanetId, stars, accuracy)

      // Track newly unlocked planet for animation (next planet if stars > 0 and first completion)
      if (stars > 0 && isFirstCompletion) {
        setNewlyUnlockedPlanetId(activePlanetId + 1)
      }
    }

    // Show celebration screen
    setCurrentScreen('celebration')
  }, [activePlanetId, updatePlanetStars, isFirstCompletion])

  const handleCelebrationContinue = useCallback(() => {
    setActivePlanetId(null)
    setCurrentScreen('map')
    // Clear the animation flag after a delay to let the animation play
    setTimeout(() => {
      setNewlyUnlockedPlanetId(null)
    }, 2000)
  }, [])

  const handleExit = useCallback(() => {
    setCurrentScreen('map')
  }, [])

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'map' && (
        <motion.div
          key="map"
          className="min-h-screen bg-space-dark text-white font-sans flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <motion.header
            className="p-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gold">{APP_NAME}</h1>
            <p className="text-white/60 text-sm">Explora el Sistema Solar</p>
          </motion.header>

          {/* Star Counter */}
          <StarCounter />

          {/* Main Content - Solar Map */}
          <SolarMap
            onPlanetClick={handlePlanetClick}
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
          <CelebrationScreen
            stars={lastStars}
            accuracy={lastAccuracy}
            isFirstCompletion={isFirstCompletion}
            onContinue={handleCelebrationContinue}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
