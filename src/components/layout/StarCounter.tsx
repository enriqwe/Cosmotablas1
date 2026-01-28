import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export function StarCounter() {
  const totalStars = useGameStore((state) => state.totalStars)

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-space-navy/80 backdrop-blur-sm px-4 py-2 rounded-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-2xl">⭐</span>
      <motion.span
        key={totalStars}
        className="text-2xl font-semibold text-gold"
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {totalStars}
      </motion.span>
    </motion.div>
  )
}
