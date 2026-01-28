import { create } from 'zustand'
import type { Question, SessionAnswer } from '@/types/game.types'
import { generateQuestions } from '@/utils/questionGenerator'

interface SessionStore {
  isPlaying: boolean
  currentPlanetId: number | null
  questions: Question[]
  currentQuestionIndex: number
  sessionAnswers: SessionAnswer[]
  currentAnswer: string

  startSession: (planetId: number, table: number) => void
  submitAnswer: (answer: number) => boolean
  nextQuestion: () => void
  endSession: () => number
  exitSession: () => void
  setCurrentAnswer: (answer: string) => void
  clearCurrentAnswer: () => void
  getCurrentQuestion: () => Question | null
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  isPlaying: false,
  currentPlanetId: null,
  questions: [],
  currentQuestionIndex: 0,
  sessionAnswers: [],
  currentAnswer: '',

  startSession: (planetId: number, table: number) => {
    const questions = generateQuestions(table, 20)
    const sessionAnswers: SessionAnswer[] = questions.map((q) => ({
      questionId: q.id,
      userAnswer: null,
      attempts: 0,
      isCorrect: false,
    }))

    set({
      isPlaying: true,
      currentPlanetId: planetId,
      questions,
      currentQuestionIndex: 0,
      sessionAnswers,
      currentAnswer: '',
    })
  },

  submitAnswer: (answer: number) => {
    const { questions, currentQuestionIndex, sessionAnswers } = get()
    const currentQuestion = questions[currentQuestionIndex]

    if (!currentQuestion) return false

    const isCorrect = answer === currentQuestion.correctAnswer
    const currentSessionAnswer = sessionAnswers[currentQuestionIndex]
    const isFirstAttempt = currentSessionAnswer.attempts === 0

    set({
      sessionAnswers: sessionAnswers.map((sa, idx) =>
        idx === currentQuestionIndex
          ? {
              ...sa,
              userAnswer: answer,
              attempts: sa.attempts + 1,
              isCorrect: isFirstAttempt ? isCorrect : sa.isCorrect,
            }
          : sa
      ),
    })

    return isCorrect
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get()
    if (currentQuestionIndex < questions.length - 1) {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        currentAnswer: '',
      })
    }
  },

  endSession: () => {
    const { sessionAnswers } = get()
    const correctFirstAttempts = sessionAnswers.filter((sa) => sa.isCorrect).length
    const totalQuestions = sessionAnswers.length
    const accuracy = Math.round((correctFirstAttempts / totalQuestions) * 100)

    set({
      isPlaying: false,
      currentPlanetId: null,
      questions: [],
      currentQuestionIndex: 0,
      sessionAnswers: [],
      currentAnswer: '',
    })

    return accuracy
  },

  exitSession: () => {
    set({
      isPlaying: false,
      currentPlanetId: null,
      questions: [],
      currentQuestionIndex: 0,
      sessionAnswers: [],
      currentAnswer: '',
    })
  },

  setCurrentAnswer: (answer: string) => {
    set({ currentAnswer: answer })
  },

  clearCurrentAnswer: () => {
    set({ currentAnswer: '' })
  },

  getCurrentQuestion: () => {
    const { questions, currentQuestionIndex } = get()
    return questions[currentQuestionIndex] || null
  },
}))
