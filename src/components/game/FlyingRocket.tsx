import { motion, AnimatePresence } from 'framer-motion'

interface FlyingRocketProps {
  isVisible: boolean
}

export function FlyingRocket({ isVisible }: FlyingRocketProps) {
  // Random starting position (left side, random height)
  const startY = Math.random() * 60 + 20 // 20-80% of screen height

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-50"
          initial={{
            left: '-10%',
            top: `${startY}%`,
            rotate: -15,
            scale: 0.8
          }}
          animate={{
            left: '110%',
            top: `${startY - 20}%`,
            rotate: 15,
            scale: 1.2
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: 'easeInOut'
          }}
        >
          <div className="text-5xl transform">
            🚀
          </div>
          {/* Trail effect */}
          <motion.div
            className="absolute -left-8 top-1/2 -translate-y-1/2 flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, repeat: 1 }}
          >
            <span className="text-2xl opacity-60">✨</span>
            <span className="text-xl opacity-40">✨</span>
            <span className="text-lg opacity-20">✨</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
