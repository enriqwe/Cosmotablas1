import { motion, AnimatePresence } from 'framer-motion'
import type { Question } from '@/types/game.types'

interface QuestionCardProps {
  question: Question
  userAnswer: string
  feedback: 'correct' | 'incorrect' | null
}

export function QuestionCard({ question, userAnswer, feedback }: QuestionCardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Question Card */}
      <motion.div
        className={`bg-space-navy rounded-2xl p-8 mx-4 border-4 transition-colors duration-300 ${
          feedback === 'correct'
            ? 'border-success'
            : feedback === 'incorrect'
              ? 'border-warning'
              : 'border-transparent'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Question */}
        <div className="text-center">
          <span className="text-4xl font-bold text-white">
            {question.table} × {question.multiplier} =
          </span>
          <span className="text-4xl font-bold text-gold ml-2">
            {userAnswer || '?'}
          </span>
        </div>
      </motion.div>

      {/* Feedback Message - Below the card */}
      <div className="h-16 flex items-center justify-center mt-4">
        <AnimatePresence mode="wait">
          {feedback === 'correct' && (
            <motion.div
              key="correct"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-4xl text-success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ✓
              </motion.span>
              <span className="text-xl font-bold text-success">¡Correcto!</span>
            </motion.div>
          )}

          {feedback === 'incorrect' && (
            <motion.div
              key="incorrect"
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-3xl"
                animate={{ x: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                ✗
              </motion.span>
              <span className="text-xl font-bold text-warning">¡Inténtalo de nuevo!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
