import { motion } from 'framer-motion'

interface ProgressIndicatorProps {
  current: number
  total: number
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const progress = (current / total) * 100

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-2">
        <motion.span
          key={current}
          className="text-xl font-semibold text-gray-300"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          Pregunta {current} de {total}
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-space-navy rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-space-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
