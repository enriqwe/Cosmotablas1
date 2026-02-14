export type PlanetStatus = 'locked' | 'unlocked' | 'completed'

export type StarLevel = 0 | 1 | 2 | 3 | 4 | 5

export interface Planet {
  id: number
  table: number
  status: PlanetStatus
  stars: StarLevel
  bestAccuracy: number
}

export interface GameState {
  planets: Planet[]
  totalStars: number
}

export interface Question {
  id: string
  table: number
  multiplier: number
  correctAnswer: number
}

export interface SessionAnswer {
  questionId: string
  userAnswer: number | null
  attempts: number
  isCorrect: boolean
  responseTimeMs: number | null
}

export interface SessionResult {
  accuracy: number
  correctCount: number
  wrongCount: number
  totalTimeMs: number
  averageResponseTimeMs: number
  mistakes: { table: number; multiplier: number }[]
}
