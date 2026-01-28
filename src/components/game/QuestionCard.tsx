import { motion, AnimatePresence } from 'framer-motion'
import type { Question } from '@/types/game.types'

interface QuestionCardProps {
  question: Question
  userAnswer: string
  feedback: 'correct' | 'incorrect' | null
}

export function QuestionCard({ question, userAnswer, feedback }: QuestionCardProps) {
  return (
    <motion.div
      className="bg-space-navy rounded-2xl p-8 mx-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Question */}
      <div className="text-center mb-6">
        <span className="text-4xl font-bold text-white">
          {question.table} × {question.multiplier} =
        </span>
        <span className="text-4xl font-bold text-gold ml-2">
          {userAnswer || '?'}
        </span>
      </div>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            className="absolute inset-0 bg-success/20 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="text-6xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              ✓
            </motion.span>
          </motion.div>
        )}

        {feedback === 'incorrect' && (
          <motion.div
            className="absolute inset-0 bg-warning/10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.p
              className="text-2xl font-bold text-warning"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              ¡Inténtalo de nuevo!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
