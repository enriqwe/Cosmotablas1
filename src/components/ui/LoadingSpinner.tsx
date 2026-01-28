import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center">
      <motion.div
        className="w-12 h-12 border-4 border-space-blue border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
