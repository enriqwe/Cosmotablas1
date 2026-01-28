import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSessionStore } from '@/store/sessionStore'
import { NumericKeyboard } from '@/components/game/NumericKeyboard'
import { QuestionCard } from '@/components/game/QuestionCard'
import { ProgressIndicator } from '@/components/game/ProgressIndicator'
import type { SessionResult } from '@/types/game.types'

interface GameSessionProps {
  onSessionEnd: (result: SessionResult) => void
  onExit: () => void
}

export function GameSession({ onSessionEnd, onExit }: GameSessionProps) {
  const {
    questions,
    currentQuestionIndex,
    currentAnswer,
    setCurrentAnswer,
    clearCurrentAnswer,
    submitAnswer,
    nextQuestion,
    endSession,
    exitSession,
    getCurrentQuestion,
  } = useSessionStore()

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const currentQuestion = getCurrentQuestion()

  const handleNumberPress = useCallback((num: number) => {
    if (feedback) return // Ignore input during feedback
    if (currentAnswer.length < 3) {
      setCurrentAnswer(currentAnswer + num.toString())
    }
  }, [currentAnswer, setCurrentAnswer, feedback])

  const handleDelete = useCallback(() => {
    if (feedback) return
    setCurrentAnswer(currentAnswer.slice(0, -1))
  }, [currentAnswer, setCurrentAnswer, feedback])

  const handleSubmit = useCallback(() => {
    if (feedback || !currentAnswer) return

    const answer = parseInt(currentAnswer, 10)
    const isCorrect = submitAnswer(answer)

    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      // Auto-advance after correct answer
      setTimeout(() => {
        setFeedback(null)
        if (currentQuestionIndex < questions.length - 1) {
          nextQuestion()
        } else {
          // Session complete
          const result = endSession()
          onSessionEnd(result)
        }
      }, 1000)
    } else {
      // Clear answer and allow retry
      setTimeout(() => {
        setFeedback(null)
        clearCurrentAnswer()
      }, 1000)
    }
  }, [
    currentAnswer,
    submitAnswer,
    currentQuestionIndex,
    questions.length,
    nextQuestion,
    endSession,
    onSessionEnd,
    clearCurrentAnswer,
    feedback,
  ])

  const handleExit = useCallback(() => {
    exitSession()
    onExit()
  }, [exitSession, onExit])

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-space-dark flex flex-col">
      {/* Header with exit button */}
      <div className="flex items-center justify-between p-4">
        <motion.button
          onClick={handleExit}
          className="w-12 h-12 bg-space-navy rounded-full flex items-center justify-center text-white text-xl"
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
        <div className="flex-1 ml-4">
          <ProgressIndicator
            current={currentQuestionIndex + 1}
            total={questions.length}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <QuestionCard
          question={currentQuestion}
          userAnswer={currentAnswer}
          feedback={feedback}
        />
      </div>

      {/* Keyboard */}
      <div className="pb-8">
        <NumericKeyboard
          onNumberPress={handleNumberPress}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
