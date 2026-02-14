import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
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

const MIN_ZOOM = 0.3
const MAX_ZOOM = 2.0

export function SolarMap({ onPlanetClick, onSunClick, newlyUnlockedPlanetId }: SolarMapProps) {
  const planets = useGameStore((state) => state.planets)
  const totalStars = useGameStore((state) => state.totalStars)
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setIsAnimating] = useState(false)

  // Transform state: pan (in screen pixels) and zoom
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Drag refs
  const isDragging = useRef(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const dragStartPan = useRef({ x: 0, y: 0 })
  const hasDragged = useRef(false)

  // Touch refs
  const lastPinchDist = useRef<number | null>(null)
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null)
  const isTouching = useRef(false)

  // Initial centering on mount
  // useLayoutEffect fires synchronously after DOM commit, before paint.
  // Read planets directly from the store to avoid stale closures.
  useLayoutEffect(() => {
    const doCenter = () => {
      const container = containerRef.current
      if (!container || container.clientHeight === 0) return false
      const currentPlanets = useGameStore.getState().planets
      let targetIndex = 0
      const unlockedIdx = currentPlanets.findIndex(p => p.status === 'unlocked')
      if (unlockedIdx !== -1) {
        targetIndex = unlockedIdx
      } else {
        for (let i = currentPlanets.length - 1; i >= 0; i--) {
          if (currentPlanets[i].status === 'completed') { targetIndex = i; break }
        }
      }
      const pos = getPlanetPosition(targetIndex)
      setPan({
        x: container.clientWidth / 2 - pos.x,
        y: container.clientHeight / 2 - pos.y,
      })
      return true
    }

    if (!doCenter()) {
      // Fallback: retry after AnimatePresence transition settles
      const timer = setTimeout(doCenter, 400)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      const container = containerRef.current
      if (!container) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const currentX = fromPos.x + (toPos.x - fromPos.x) * eased
      const currentY = fromPos.y + (toPos.y - fromPos.y) * eased

      const cw = container.clientWidth
      const ch = container.clientHeight
      setPan({
        x: cw / 2 - currentX * zoom,
        y: ch / 2 - currentY * zoom,
      })

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
  }, [newlyUnlockedPlanetId, planets.length, zoom])

  // === MOUSE: wheel to zoom, drag to pan ===

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const container = containerRef.current
    if (!container) return

    // Cursor position relative to container
    const rect = container.getBoundingClientRect()
    const cursorX = e.clientX - rect.left
    const cursorY = e.clientY - rect.top

    const factor = e.deltaY > 0 ? 0.92 : 1.08
    setZoom(prevZoom => {
      const newZoom = Math.min(Math.max(prevZoom * factor, MIN_ZOOM), MAX_ZOOM)
      const ratio = newZoom / prevZoom
      // Zoom towards cursor: adjust pan so the point under cursor stays fixed
      setPan(prevPan => ({
        x: cursorX - ratio * (cursorX - prevPan.x),
        y: cursorY - ratio * (cursorY - prevPan.y),
      }))
      return newZoom
    })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return
    isDragging.current = true
    hasDragged.current = false
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    dragStartPan.current = { ...pan }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStartPos.current.x
    const dy = e.clientY - dragStartPos.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDragged.current = true
    }
    setPan({
      x: dragStartPan.current.x + dx,
      y: dragStartPan.current.y + dy,
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false
  }, [])

  // === TOUCH: 1 finger to pan, 2 fingers to zoom+pan ===

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isTouching.current = true
      hasDragged.current = false
      dragStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      dragStartPan.current = { ...pan }
      lastPinchDist.current = null
      lastTouchCenter.current = null
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy)
      lastTouchCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      }
    }
  }, [pan])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isTouching.current && lastPinchDist.current === null) {
      // Single finger pan
      const dx = e.touches[0].clientX - dragStartPos.current.x
      const dy = e.touches[0].clientY - dragStartPos.current.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDragged.current = true
      }
      setPan({
        x: dragStartPan.current.x + dx,
        y: dragStartPan.current.y + dy,
      })
    } else if (e.touches.length === 2 && lastPinchDist.current !== null && lastTouchCenter.current !== null) {
      // Pinch zoom + two-finger pan
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2

      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const cx = centerX - rect.left
      const cy = centerY - rect.top

      const scale = dist / lastPinchDist.current
      // Pan offset from two-finger movement
      const panDx = centerX - lastTouchCenter.current.x
      const panDy = centerY - lastTouchCenter.current.y

      lastPinchDist.current = dist
      lastTouchCenter.current = { x: centerX, y: centerY }

      setZoom(prevZoom => {
        const newZoom = Math.min(Math.max(prevZoom * scale, MIN_ZOOM), MAX_ZOOM)
        const ratio = newZoom / prevZoom
        setPan(prevPan => ({
          x: cx - ratio * (cx - prevPan.x) + panDx,
          y: cy - ratio * (cy - prevPan.y) + panDy,
        }))
        return newZoom
      })
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    isTouching.current = false
    lastPinchDist.current = null
    lastTouchCenter.current = null
  }, [])

  // Zoom buttons
  const handleZoomIn = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cw = container.clientWidth / 2
    const ch = container.clientHeight / 2
    setZoom(prevZoom => {
      const newZoom = Math.min(prevZoom * 1.25, MAX_ZOOM)
      const ratio = newZoom / prevZoom
      setPan(prevPan => ({
        x: cw - ratio * (cw - prevPan.x),
        y: ch - ratio * (ch - prevPan.y),
      }))
      return newZoom
    })
  }, [])

  const handleZoomOut = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cw = container.clientWidth / 2
    const ch = container.clientHeight / 2
    setZoom(prevZoom => {
      const newZoom = Math.max(prevZoom / 1.25, MIN_ZOOM)
      const ratio = newZoom / prevZoom
      setPan(prevPan => ({
        x: cw - ratio * (cw - prevPan.x),
        y: ch - ratio * (ch - prevPan.y),
      }))
      return newZoom
    })
  }, [])

  // Suppress click on planets after dragging
  const handlePlanetClick = useCallback((planetId: number) => {
    if (hasDragged.current) return
    onPlanetClick(planetId)
  }, [onPlanetClick])

  const handleSunClick = useCallback(() => {
    if (hasDragged.current) return
    onSunClick?.()
  }, [onSunClick])

  // Source planet for unlock animation
  const sourcePlanetId = newlyUnlockedPlanetId ? newlyUnlockedPlanetId - 1 : null

  return (
    <div className="flex-1 relative overflow-hidden">
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

      {/* Interactive canvas */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{
          cursor: isDragging.current ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Transformed content */}
        <div
          style={{
            width: `${SYSTEM_SIZE}px`,
            height: `${SYSTEM_SIZE}px`,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
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
            <Sun totalStars={totalStars} maxStars={40} onClick={handleSunClick} />
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
                  onClick={() => handlePlanetClick(planet.id)}
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
  )
}

// Export for use in other components
export { orbitalConfigs, getPlanetPosition, CENTER, SYSTEM_SIZE }
