import { create } from 'zustand'
import type { Question, SessionAnswer, SessionResult } from '@/types/game.types'
import { generateQuestions } from '@/utils/questionGenerator'

const QUESTIONS_PER_SESSION = 10

interface SessionStore {
  isPlaying: boolean
  currentPlanetId: number | null
  questions: Question[]
  currentQuestionIndex: number
  sessionAnswers: SessionAnswer[]
  currentAnswer: string
  sessionStartTime: number | null
  questionStartTime: number | null

  startSession: (planetId: number, table: number) => void
  submitAnswer: (answer: number) => boolean
  nextQuestion: () => void
  endSession: () => SessionResult
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
  sessionStartTime: null,
  questionStartTime: null,

  startSession: (planetId: number, table: number) => {
    const questions = generateQuestions(table, QUESTIONS_PER_SESSION)
    const now = Date.now()
    const sessionAnswers: SessionAnswer[] = questions.map((q) => ({
      questionId: q.id,
      userAnswer: null,
      attempts: 0,
      isCorrect: false,
      responseTimeMs: null,
    }))

    set({
      isPlaying: true,
      currentPlanetId: planetId,
      questions,
      currentQuestionIndex: 0,
      sessionAnswers,
      currentAnswer: '',
      sessionStartTime: now,
      questionStartTime: now,
    })
  },

  submitAnswer: (answer: number) => {
    const { questions, currentQuestionIndex, sessionAnswers, questionStartTime } = get()
    const currentQuestion = questions[currentQuestionIndex]

    if (!currentQuestion) return false

    const now = Date.now()
    const responseTime = questionStartTime ? now - questionStartTime : 0
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
              responseTimeMs: isFirstAttempt ? responseTime : sa.responseTimeMs,
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
        questionStartTime: Date.now(),
      })
    }
  },

  endSession: () => {
    const { sessionAnswers, sessionStartTime } = get()
    const now = Date.now()

    const correctCount = sessionAnswers.filter((sa) => sa.isCorrect).length
    const wrongCount = sessionAnswers.length - correctCount
    const totalQuestions = sessionAnswers.length
    const accuracy = Math.round((correctCount / totalQuestions) * 100)

    const totalTimeMs = sessionStartTime ? now - sessionStartTime : 0

    // Calculate average response time from first attempts
    const responseTimes = sessionAnswers
      .filter((sa) => sa.responseTimeMs !== null)
      .map((sa) => sa.responseTimeMs as number)
    const averageResponseTimeMs = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0

    set({
      isPlaying: false,
      currentPlanetId: null,
      questions: [],
      currentQuestionIndex: 0,
      sessionAnswers: [],
      currentAnswer: '',
      sessionStartTime: null,
      questionStartTime: null,
    })

    return {
      accuracy,
      correctCount,
      wrongCount,
      totalTimeMs,
      averageResponseTimeMs,
    }
  },

  exitSession: () => {
    set({
      isPlaying: false,
      currentPlanetId: null,
      questions: [],
      currentQuestionIndex: 0,
      sessionAnswers: [],
      currentAnswer: '',
      sessionStartTime: null,
      questionStartTime: null,
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
