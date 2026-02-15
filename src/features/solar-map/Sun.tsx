import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface SunProps {
  totalStars: number
  maxStars: number
  onClick?: () => void
}

// Each ray layer config: how fast it rotates, how many rays, their size, etc.
interface RayLayer {
  id: number
  duration: number      // rotation period in seconds
  direction: 1 | -1     // 1 = clockwise, -1 = counter-clockwise
  rayCount: number       // how many rays in this ring
  width: number          // ray width in px
  height: number         // ray height in px
  originDist: number     // distance from center to transform-origin (px)
  topOffset: string      // CSS top position
  color: string          // gradient color
  opacityRange: [number, number]  // [min, max] opacity
  pulseDuration: number  // pulse cycle in seconds
  scaleRange?: [number, number]   // optional scaleY pulse
  shape: 'line' | 'ellipse'
}

function generateRayLayers(): RayLayer[] {
  return [
    // --- Ultra-slow wide washes (3 layers) ---
    { id: 0, duration: 30, direction: 1, rayCount: 3, width: 32, height: 44, originDist: 18, topOffset: '5%', color: 'rgba(255,245,157,0.4)', opacityRange: [0.15, 0.45], pulseDuration: 4, shape: 'ellipse' },
    { id: 1, duration: 35, direction: -1, rayCount: 3, width: 26, height: 38, originDist: 22, topOffset: '8%', color: 'rgba(255,230,130,0.35)', opacityRange: [0.1, 0.4], pulseDuration: 3.5, shape: 'ellipse' },
    { id: 2, duration: 28, direction: 1, rayCount: 4, width: 30, height: 42, originDist: 16, topOffset: '3%', color: 'rgba(255,250,200,0.3)', opacityRange: [0.12, 0.42], pulseDuration: 4.5, shape: 'ellipse' },

    // --- Slow broad sweeps (3 layers) ---
    { id: 3, duration: 25, direction: 1, rayCount: 4, width: 28, height: 40, originDist: 20, topOffset: '5%', color: 'rgba(255,245,157,0.5)', opacityRange: [0.2, 0.55], pulseDuration: 3, shape: 'ellipse' },
    { id: 4, duration: 22, direction: -1, rayCount: 5, width: 20, height: 34, originDist: 24, topOffset: '4%', color: 'rgba(255,235,100,0.4)', opacityRange: [0.15, 0.5], pulseDuration: 2.8, shape: 'ellipse' },
    { id: 5, duration: 27, direction: 1, rayCount: 3, width: 24, height: 36, originDist: 26, topOffset: '2%', color: 'rgba(255,255,180,0.35)', opacityRange: [0.18, 0.48], pulseDuration: 3.2, shape: 'ellipse' },

    // --- Medium corona flares (4 layers) ---
    { id: 6, duration: 20, direction: 1, rayCount: 6, width: 6, height: 20, originDist: 56, topOffset: '-10px', color: 'rgba(255,238,88,0.6)', opacityRange: [0.3, 0.7], pulseDuration: 1.5, scaleRange: [0.8, 1.2], shape: 'line' },
    { id: 7, duration: 18, direction: -1, rayCount: 5, width: 5, height: 18, originDist: 50, topOffset: '-6px', color: 'rgba(255,245,120,0.5)', opacityRange: [0.25, 0.65], pulseDuration: 1.8, scaleRange: [0.7, 1.3], shape: 'line' },
    { id: 8, duration: 16, direction: 1, rayCount: 7, width: 4, height: 16, originDist: 52, topOffset: '-8px', color: 'rgba(255,220,80,0.55)', opacityRange: [0.2, 0.6], pulseDuration: 1.4, scaleRange: [0.85, 1.15], shape: 'line' },
    { id: 9, duration: 23, direction: -1, rayCount: 4, width: 7, height: 22, originDist: 54, topOffset: '-12px', color: 'rgba(255,240,100,0.45)', opacityRange: [0.28, 0.68], pulseDuration: 2, scaleRange: [0.75, 1.25], shape: 'line' },

    // --- Fast shimmer rays (4 layers) ---
    { id: 10, duration: 12, direction: -1, rayCount: 8, width: 2, height: 14, originDist: 48, topOffset: '-4px', color: 'rgba(255,235,59,0.6)', opacityRange: [0.15, 0.6], pulseDuration: 1, scaleRange: [0.6, 1.3], shape: 'line' },
    { id: 11, duration: 10, direction: 1, rayCount: 10, width: 2, height: 12, originDist: 44, topOffset: '-2px', color: 'rgba(255,245,80,0.5)', opacityRange: [0.1, 0.55], pulseDuration: 0.8, scaleRange: [0.5, 1.4], shape: 'line' },
    { id: 12, duration: 14, direction: -1, rayCount: 6, width: 3, height: 16, originDist: 46, topOffset: '-6px', color: 'rgba(255,230,70,0.55)', opacityRange: [0.12, 0.58], pulseDuration: 1.2, scaleRange: [0.65, 1.25], shape: 'line' },
    { id: 13, duration: 9, direction: 1, rayCount: 12, width: 1.5, height: 10, originDist: 42, topOffset: '0px', color: 'rgba(255,250,100,0.45)', opacityRange: [0.08, 0.5], pulseDuration: 0.7, scaleRange: [0.55, 1.35], shape: 'line' },

    // --- Very fast micro-flickers (3 layers) ---
    { id: 14, duration: 7, direction: -1, rayCount: 16, width: 1, height: 8, originDist: 40, topOffset: '2px', color: 'rgba(255,255,200,0.4)', opacityRange: [0.05, 0.45], pulseDuration: 0.6, scaleRange: [0.4, 1.5], shape: 'line' },
    { id: 15, duration: 6, direction: 1, rayCount: 14, width: 1.5, height: 9, originDist: 38, topOffset: '1px', color: 'rgba(255,240,150,0.35)', opacityRange: [0.06, 0.4], pulseDuration: 0.5, scaleRange: [0.45, 1.45], shape: 'line' },
    { id: 16, duration: 8, direction: -1, rayCount: 10, width: 2, height: 11, originDist: 36, topOffset: '0px', color: 'rgba(255,255,220,0.3)', opacityRange: [0.07, 0.42], pulseDuration: 0.65, scaleRange: [0.5, 1.4], shape: 'line' },

    // --- Spotlight beams (3 layers) ---
    { id: 17, duration: 8, direction: 1, rayCount: 1, width: 36, height: 50, originDist: 0, topOffset: '0%', color: 'rgba(255,255,224,0.35)', opacityRange: [0.15, 0.4], pulseDuration: 2, shape: 'ellipse' },
    { id: 18, duration: 11, direction: -1, rayCount: 2, width: 24, height: 40, originDist: 10, topOffset: '5%', color: 'rgba(255,245,180,0.3)', opacityRange: [0.1, 0.35], pulseDuration: 2.5, shape: 'ellipse' },
    { id: 19, duration: 15, direction: 1, rayCount: 2, width: 30, height: 46, originDist: 8, topOffset: '2%', color: 'rgba(255,250,200,0.25)', opacityRange: [0.12, 0.38], pulseDuration: 3, shape: 'ellipse' },
  ]
}

export function Sun({ totalStars, maxStars, onClick }: SunProps) {
  const fillPercent = Math.min((totalStars / maxStars) * 100, 100)
  const rayLayers = useMemo(() => generateRayLayers(), [])

  return (
    <motion.div
      className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outermost soft halo */}
      <motion.div
        className="absolute w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 220, 80, 0.1) 0%, transparent 65%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Outer glow layers */}
      <motion.div
        className="absolute w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 200, 50, 0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-44 h-44 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 180, 50, 0.3) 0%, transparent 60%)',
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Bright core pulse */}
      <motion.div
        className="absolute w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 220, 0.4) 0%, transparent 60%)',
        }}
        animate={{
          scale: [0.95, 1.08, 0.95],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Sun body */}
      <div
        className="relative w-28 h-28 rounded-full overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fff9c4 0%, #ffd54f 30%, #ff9800 60%, #e65100 100%)',
          boxShadow: '0 0 40px rgba(255, 152, 0, 0.8), 0 0 80px rgba(255, 152, 0, 0.4), inset 0 0 30px rgba(255, 235, 59, 0.5)',
        }}
      >
        {/* Sun surface texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 30%),
              radial-gradient(ellipse at 70% 60%, rgba(255,100,0,0.3) 0%, transparent 25%),
              radial-gradient(ellipse at 40% 70%, rgba(255,200,0,0.3) 0%, transparent 20%)
            `,
          }}
        />

        {/* 20 ray layers — data-driven */}
        {rayLayers.map((layer) => {
          const angles = Array.from(
            { length: layer.rayCount },
            (_, i) => (360 / layer.rayCount) * i
          )
          return (
            <motion.div
              key={`layer-${layer.id}`}
              className="absolute inset-0"
              animate={{ rotate: 360 * layer.direction }}
              transition={{ duration: layer.duration, repeat: Infinity, ease: 'linear' }}
            >
              {angles.map((angle) => (
                <motion.div
                  key={`${layer.id}-${angle}`}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: layer.topOffset,
                    width: layer.width,
                    height: layer.height,
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                    transformOrigin: layer.originDist > 0
                      ? `50% calc(100% + ${layer.originDist}px)`
                      : '50% 100%',
                    background: layer.shape === 'ellipse'
                      ? `radial-gradient(ellipse at 50% 0%, ${layer.color} 0%, transparent 70%)`
                      : `linear-gradient(to top, transparent, ${layer.color}, transparent)`,
                    borderRadius: layer.shape === 'ellipse' ? '50%' : undefined,
                  }}
                  animate={{
                    opacity: [layer.opacityRange[0], layer.opacityRange[1], layer.opacityRange[0]],
                    ...(layer.scaleRange
                      ? { scaleY: [layer.scaleRange[0], layer.scaleRange[1], layer.scaleRange[0]] }
                      : {}),
                  }}
                  transition={{
                    duration: layer.pulseDuration,
                    delay: (angle / 360) * layer.pulseDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )
        })}
      </div>

      {/* Star counter and stats label in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span
          className="text-2xl font-bold text-white drop-shadow-lg"
          style={{
            textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 20px rgba(255,200,0,0.5)',
          }}
          key={totalStars}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {totalStars}
        </motion.span>
        <span
          className="text-sm text-white/80"
          style={{
            textShadow: '0 0 5px rgba(0,0,0,0.8)',
          }}
        >
          ⭐
        </span>
        <span
          className="text-[9px] text-white/60 mt-0.5 tracking-wide"
          style={{
            textShadow: '0 0 5px rgba(0,0,0,0.8)',
          }}
        >
          RÉCORDS
        </span>
      </div>

      {/* Progress ring around sun */}
      <svg
        className="absolute w-32 h-32 -rotate-90 pointer-events-none"
        viewBox="0 0 100 100"
      >
        {/* Background ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        {/* Progress ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#sunGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${fillPercent * 2.83} 283`}
          initial={{ strokeDasharray: '0 283' }}
          animate={{ strokeDasharray: `${fillPercent * 2.83} 283` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffd54f" />
            <stop offset="50%" stopColor="#ff9800" />
            <stop offset="100%" stopColor="#ff5722" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}
