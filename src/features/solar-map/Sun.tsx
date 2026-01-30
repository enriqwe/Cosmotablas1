import { motion } from 'framer-motion'

interface SunProps {
  totalStars: number
  maxStars: number
}

export function Sun({ totalStars, maxStars }: SunProps) {
  const fillPercent = Math.min((totalStars / maxStars) * 100, 100)

  return (
    <motion.div
      className="relative w-20 h-20 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Outer glow layers */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
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
        className="absolute w-28 h-28 rounded-full pointer-events-none"
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

      {/* Sun body */}
      <div
        className="relative w-16 h-16 rounded-full overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fff9c4 0%, #ffd54f 30%, #ff9800 60%, #e65100 100%)',
          boxShadow: '0 0 30px rgba(255, 152, 0, 0.8), 0 0 60px rgba(255, 152, 0, 0.4), inset 0 0 20px rgba(255, 235, 59, 0.5)',
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

        {/* Corona flares */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <motion.div
              key={angle}
              className="absolute w-1 h-4 bg-gradient-to-t from-transparent via-yellow-300 to-transparent"
              style={{
                left: '50%',
                top: '-8px',
                transform: `translateX(-50%) rotate(${angle}deg)`,
                transformOrigin: '50% calc(100% + 32px)',
                opacity: 0.6,
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: angle / 360,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Star counter in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span
          className="text-xl font-bold text-white drop-shadow-lg"
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
          className="text-xs text-white/80"
          style={{
            textShadow: '0 0 5px rgba(0,0,0,0.8)',
          }}
        >
          ⭐
        </span>
      </div>

      {/* Progress ring around sun */}
      <svg
        className="absolute w-20 h-20 -rotate-90 pointer-events-none"
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
