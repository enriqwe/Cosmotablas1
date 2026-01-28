import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SolarMap } from '@/features/solar-map/SolarMap'
import { GameSession } from '@/features/gameplay/GameSession'
import { StarCounter } from '@/components/layout/StarCounter'
import { useSessionStore } from '@/store/sessionStore'
import { useGameStore } from '@/store/gameStore'
import { APP_NAME } from '@/constants/config'

type Screen = 'map' | 'game' | 'celebration'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map')
  const [_lastAccuracy, setLastAccuracy] = useState<number>(0)

  const startSession = useSessionStore((state) => state.startSession)
  const planets = useGameStore((state) => state.planets)

  const handlePlanetClick = useCallback((planetId: number) => {
    const planet = planets.find((p) => p.id === planetId)
    if (!planet) return

    if (planet.status === 'locked') {
      alert('¡Completa el planeta anterior primero!')
      return
    }

    // Start session for unlocked or completed planets
    startSession(planetId, planet.table)
    setCurrentScreen('game')
  }, [planets, startSession])

  const handleSessionEnd = useCallback((accuracy: number) => {
    setLastAccuracy(accuracy)
    // For now, just go back to map. Celebration screen will be added in Epic 3
    setCurrentScreen('map')
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
          <SolarMap onPlanetClick={handlePlanetClick} />
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
    </AnimatePresence>
  )
}

export default App
