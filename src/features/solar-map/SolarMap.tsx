import { useEffect, useRef, useState, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Planet } from './Planet'
import { Sun } from './Sun'
import { UnlockSpaceship } from './UnlockSpaceship'
import { motion } from 'framer-motion'

interface SolarMapProps {
  onPlanetClick: (planetId: number) => void
  newlyUnlockedPlanetId?: number | null
}

// Solar system size
const SYSTEM_SIZE = 1400
const CENTER = SYSTEM_SIZE / 2

// Orbital configurations - each planet at a different distance from the sun
const orbitalConfigs = [
  { orbitRadius: 100, angle: 0, planetSize: 'medium' as const },    // Planet 1 (table 2)
  { orbitRadius: 160, angle: 45, planetSize: 'medium' as const },   // Planet 2 (table 3)
  { orbitRadius: 220, angle: 120, planetSize: 'medium' as const },  // Planet 3 (table 4)
  { orbitRadius: 280, angle: 200, planetSize: 'medium' as const },  // Planet 4 (table 5)
  { orbitRadius: 350, angle: 280, planetSize: 'large' as const },   // Planet 5 (table 6)
  { orbitRadius: 420, angle: 30, planetSize: 'large' as const },    // Planet 6 (table 7)
  { orbitRadius: 500, angle: 150, planetSize: 'medium' as const },  // Planet 7 (table 8)
  { orbitRadius: 580, angle: 240, planetSize: 'medium' as const },  // Planet 8 (table 9)
]

// Get planet position from orbital config
function getPlanetPosition(index: number) {
  const config = orbitalConfigs[index]
  if (!config) return { x: CENTER, y: CENTER }

  const angleRad = (config.angle * Math.PI) / 180
  const x = CENTER + Math.cos(angleRad) * config.orbitRadius
  const y = CENTER + Math.sin(angleRad) * config.orbitRadius

  return { x, y, orbitRadius: config.orbitRadius }
}

export function SolarMap({ onPlanetClick, newlyUnlockedPlanetId }: SolarMapProps) {
  const planets = useGameStore((state) => state.planets)
  const totalStars = useGameStore((state) => state.totalStars)
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setIsAnimating] = useState(false)

  // Find the last unlocked or first incomplete planet to center on
  const getTargetPlanetIndex = useCallback(() => {
    // Find the first unlocked (not completed) planet
    const unlockedIndex = planets.findIndex(p => p.status === 'unlocked')
    if (unlockedIndex !== -1) return unlockedIndex

    // Otherwise find the last completed planet
    for (let i = planets.length - 1; i >= 0; i--) {
      if (planets[i].status === 'completed') return i
    }

    // Default to first planet
    return 0
  }, [planets])

  // Center the view on a specific position
  const centerOnPosition = useCallback((x: number, y: number, smooth = true) => {
    const container = containerRef.current
    if (!container) return

    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    const scrollX = x - containerWidth / 2
    const scrollY = y - containerHeight / 2

    container.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }, [])

  // Center on target planet
  const centerOnPlanet = useCallback((planetIndex: number, smooth = true) => {
    const pos = getPlanetPosition(planetIndex)
    centerOnPosition(pos.x, pos.y, smooth)
  }, [centerOnPosition])

  // Initial centering on mount
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    const raf = requestAnimationFrame(() => {
      const targetIndex = getTargetPlanetIndex()
      // Additional delay to ensure scrollable area is fully rendered
      setTimeout(() => {
        centerOnPlanet(targetIndex, false)
      }, 100)
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Handle unlock animation with camera follow
  useEffect(() => {
    if (!newlyUnlockedPlanetId) return

    const fromIndex = newlyUnlockedPlanetId - 2 // Previous planet (0-indexed)
    const toIndex = newlyUnlockedPlanetId - 1   // New planet (0-indexed)

    if (fromIndex < 0 || toIndex >= planets.length) return

    setIsAnimating(true)

    const fromPos = getPlanetPosition(fromIndex)
    const toPos = getPlanetPosition(toIndex)

    // Animate camera from source to destination (match spaceship flight duration)
    const duration = 3500 // 3.5 seconds for the spaceship animation
    const startTime = Date.now()

    const animateCamera = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const currentX = fromPos.x + (toPos.x - fromPos.x) * eased
      const currentY = fromPos.y + (toPos.y - fromPos.y) * eased

      centerOnPosition(currentX, currentY, false)

      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      } else {
        setIsAnimating(false)
      }
    }

    // Start camera animation after a small delay
    const timer = setTimeout(() => {
      requestAnimationFrame(animateCamera)
    }, 300)

    return () => clearTimeout(timer)
  }, [newlyUnlockedPlanetId, planets.length, centerOnPosition])

  // Source planet for unlock animation
  const sourcePlanetId = newlyUnlockedPlanetId ? newlyUnlockedPlanetId - 1 : null

  return (
    <div
      ref={containerRef}
      className="flex-1 touch-pan-x touch-pan-y solar-scroll-container"
      style={{
        overflow: 'scroll',
        overflowX: 'scroll',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
      }}
    >
      <style>{`
        .solar-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div
        style={{
          width: `${SYSTEM_SIZE}px`,
          height: `${SYSTEM_SIZE}px`,
          minWidth: `${SYSTEM_SIZE}px`,
          minHeight: `${SYSTEM_SIZE}px`,
          position: 'relative',
        }}
      >
        {/* Orbital rings */}
        {orbitalConfigs.map((config, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: config.orbitRadius * 2,
              height: config.orbitRadius * 2,
              left: CENTER - config.orbitRadius,
              top: CENTER - config.orbitRadius,
              borderColor: planets[index]?.status === 'locked'
                ? 'rgba(255,255,255,0.05)'
                : planets[index]?.status === 'completed'
                  ? 'rgba(255,215,0,0.15)'
                  : 'rgba(100,150,255,0.1)',
              borderStyle: planets[index]?.status === 'locked' ? 'dashed' : 'solid',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          />
        ))}

        {/* Sun in the center */}
        <div
          className="absolute z-10"
          style={{
            left: CENTER - 40, // Half of sun size
            top: CENTER - 40,
          }}
        >
          <Sun totalStars={totalStars} maxStars={24} />
        </div>

        {/* Planets */}
        {planets.map((planet, index) => {
          const pos = getPlanetPosition(index)
          const config = orbitalConfigs[index]

          return (
            <motion.div
              key={planet.id}
              className="absolute z-20"
              style={{
                left: pos.x - 40, // Offset for planet centering
                top: pos.y - 40,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3 + index * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
            >
              <Planet
                planet={planet}
                onClick={() => onPlanetClick(planet.id)}
                showUnlockAnimation={planet.id === newlyUnlockedPlanetId}
                size={config?.planetSize || 'medium'}
              />

              {/* Planet name label */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
                style={{ top: '100%' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: planet.status === 'locked' ? 0.3 : 0.8 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="text-xs text-white/70 font-medium">
                  Tabla del {planet.table}
                </span>
              </motion.div>
            </motion.div>
          )
        })}

        {/* Unlock spaceship animation */}
        {newlyUnlockedPlanetId && sourcePlanetId && sourcePlanetId > 0 && (
          <UnlockSpaceship
            fromPlanetIndex={sourcePlanetId - 1}
            toPlanetIndex={newlyUnlockedPlanetId - 1}
            orbitalConfigs={orbitalConfigs}
            centerX={CENTER}
            centerY={CENTER}
          />
        )}
      </div>
    </div>
  )
}

// Export for use in other components
export { orbitalConfigs, getPlanetPosition, CENTER, SYSTEM_SIZE }
