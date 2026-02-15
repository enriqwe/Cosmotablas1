import type { Question } from '@/types/game.types'
import type { MistakeEntry } from '@/store/mistakesStore'

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

export function generateChallengeQuestions(mistakes: MistakeEntry[], count: number = 8): Question[] {
  if (mistakes.length === 0) return []

  // Take top mistakes sorted by count (already sorted from store/API)
  const pool = mistakes.slice(0, count)

  // Fill up to `count` by repeating cyclically if not enough unique mistakes
  const filled: MistakeEntry[] = []
  for (let i = 0; i < count; i++) {
    filled.push(pool[i % pool.length])
  }

  // Shuffle so the order isn't predictable
  const shuffled = shuffleArray(filled)

  return shuffled.map((m, index) => ({
    id: `challenge-${m.table}-${m.multiplier}-${index}`,
    table: m.table,
    multiplier: m.multiplier,
    correctAnswer: m.table * m.multiplier,
  }))
}
