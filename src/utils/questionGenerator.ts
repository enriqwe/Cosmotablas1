import type { Question } from '@/types/game.types'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Multipliers 2-9 only (8 questions per session)
const MULTIPLIERS = [2, 3, 4, 5, 6, 7, 8, 9]

export function generateQuestions(table: number, count: number = 8): Question[] {
  // Shuffle multipliers to randomize order
  const shuffledMultipliers = shuffleArray([...MULTIPLIERS])

  // Take only the requested count (max 8 unique multipliers)
  const selectedMultipliers = shuffledMultipliers.slice(0, Math.min(count, MULTIPLIERS.length))

  // Create questions
  return selectedMultipliers.map((multiplier, index) => ({
    id: `${table}-${multiplier}-${index}`,
    table,
    multiplier,
    correctAnswer: table * multiplier,
  }))
}
