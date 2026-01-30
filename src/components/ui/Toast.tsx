import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  isVisible: boolean
  type?: 'info' | 'warning' | 'success'
}

export function Toast({ message, isVisible, type = 'warning' }: ToastProps) {
  const bgColors = {
    info: 'bg-space-blue',
    warning: 'bg-warning',
    success: 'bg-success',
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 left-1/2 z-50"
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`${bgColors[type]} px-6 py-3 rounded-full shadow-lg`}
          >
            <p className="text-white font-semibold text-sm whitespace-nowrap">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
