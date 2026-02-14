import { useEffect, useRef, useState, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Planet } from './Planet'
import { Sun } from './Sun'
import { UnlockSpaceship } from './UnlockSpaceship'
import { motion } from 'framer-motion'

interface SolarMapProps {
  onPlanetClick: (planetId: number) => void
  onSunClick?: () => void
  newlyUnlockedPlanetId?: number | null
}

// Solar system size
const SYSTEM_SIZE = 1600
const CENTER = SYSTEM_SIZE / 2

// Orbital configurations - pushed further from the enlarged sun
const orbitalConfigs = [
  { orbitRadius: 150, angle: 0, planetSize: 'medium' as const },    // Planet 1 (table 2)
  { orbitRadius: 220, angle: 45, planetSize: 'medium' as const },   // Planet 2 (table 3)
  { orbitRadius: 290, angle: 120, planetSize: 'medium' as const },  // Planet 3 (table 4)
  { orbitRadius: 360, angle: 200, planetSize: 'medium' as const },  // Planet 4 (table 5)
  { orbitRadius: 430, angle: 280, planetSize: 'large' as const },   // Planet 5 (table 6)
  { orbitRadius: 510, angle: 30, planetSize: 'large' as const },    // Planet 6 (table 7)
  { orbitRadius: 590, angle: 150, planetSize: 'medium' as const },  // Planet 7 (table 8)
  { orbitRadius: 680, angle: 240, planetSize: 'medium' as const },  // Planet 8 (table 9)
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

const MIN_ZOOM = 0.4
const MAX_ZOOM = 1.8

export function SolarMap({ onPlanetClick, onSunClick, newlyUnlockedPlanetId }: SolarMapProps) {
  const planets = useGameStore((state) => state.planets)
  const totalStars = useGameStore((state) => state.totalStars)
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setIsAnimating] = useState(false)
  const [zoom, setZoom] = useState(1)
  const lastPinchDistRef = useRef<number | null>(null)

  // Find the last unlocked or first incomplete planet to center on
  const getTargetPlanetIndex = useCallback(() => {
    const unlockedIndex = planets.findIndex(p => p.status === 'unlocked')
    if (unlockedIndex !== -1) return unlockedIndex
    for (let i = planets.length - 1; i >= 0; i--) {
      if (planets[i].status === 'completed') return i
    }
    return 0
  }, [planets])

  // Center the view on a specific position (in system coordinates)
  const centerOnPosition = useCallback((x: number, y: number, smooth = true) => {
    const container = containerRef.current
    if (!container) return

    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const currentZoom = zoom

    const scrollX = x * currentZoom - containerWidth / 2
    const scrollY = y * currentZoom - containerHeight / 2

    container.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }, [zoom])

  // Center on target planet
  const centerOnPlanet = useCallback((planetIndex: number, smooth = true) => {
    const pos = getPlanetPosition(planetIndex)
    centerOnPosition(pos.x, pos.y, smooth)
  }, [centerOnPosition])

  // Initial centering on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const targetIndex = getTargetPlanetIndex()
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

    const fromIndex = newlyUnlockedPlanetId - 2
    const toIndex = newlyUnlockedPlanetId - 1

    if (fromIndex < 0 || toIndex >= planets.length) return

    setIsAnimating(true)

    const fromPos = getPlanetPosition(fromIndex)
    const toPos = getPlanetPosition(toIndex)

    const duration = 3500
    const startTime = Date.now()

    const animateCamera = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

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

    const timer = setTimeout(() => {
      requestAnimationFrame(animateCamera)
    }, 300)

    return () => clearTimeout(timer)
  }, [newlyUnlockedPlanetId, planets.length, centerOnPosition])

  // Pinch-to-zoom handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastPinchDistRef.current = Math.sqrt(dx * dx + dy * dy)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)

      const scale = dist / lastPinchDistRef.current
      lastPinchDistRef.current = dist

      setZoom(z => Math.min(Math.max(z * scale, MIN_ZOOM), MAX_ZOOM))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    lastPinchDistRef.current = null
  }, [])

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom(z => Math.min(Math.max(z * delta, MIN_ZOOM), MAX_ZOOM))
    }
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(z + 0.15, MAX_ZOOM))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(z - 0.15, MIN_ZOOM))
  }, [])

  // Source planet for unlock animation
  const sourcePlanetId = newlyUnlockedPlanetId ? newlyUnlockedPlanetId - 1 : null

  const scaledSize = SYSTEM_SIZE * zoom

  return (
    <div className="flex-1 relative">
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
        <motion.button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-space-navy/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold border border-white/10"
          whileTap={{ scale: 0.9 }}
        >
          +
        </motion.button>
        <motion.button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-space-navy/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold border border-white/10"
          whileTap={{ scale: 0.9 }}
        >
          −
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full touch-pan-x touch-pan-y solar-scroll-container"
        style={{
          overflow: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <style>{`
          .solar-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Spacer div at scaled size for scrollable area */}
        <div
          style={{
            width: `${scaledSize}px`,
            height: `${scaledSize}px`,
            minWidth: `${scaledSize}px`,
            minHeight: `${scaledSize}px`,
            position: 'relative',
          }}
        >
          {/* Scaled content */}
          <div
            style={{
              width: `${SYSTEM_SIZE}px`,
              height: `${SYSTEM_SIZE}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
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
                left: CENTER - 64,
                top: CENTER - 64,
              }}
            >
              <Sun totalStars={totalStars} maxStars={40} onClick={onSunClick} />
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
                    left: pos.x - 40,
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
      </div>
    </div>
  )
}

// Export for use in other components
export { orbitalConfigs, getPlanetPosition, CENTER, SYSTEM_SIZE }
