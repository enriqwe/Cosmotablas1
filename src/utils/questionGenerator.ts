import type { Question } from '@/types/game.types'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateQuestions(table: number, count: number = 20): Question[] {
  // Generate multipliers from 1 to 10 (or 12 for more variety)
  const multipliers = Array.from({ length: 10 }, (_, i) => i + 1)

  // Shuffle to randomize order
  const shuffledMultipliers = shuffleArray(multipliers)

  // Take only the requested count (max 10 unique multipliers)
  const selectedMultipliers = shuffledMultipliers.slice(0, Math.min(count, 10))

  // If we need more than 10 questions, add duplicates with different order
  while (selectedMultipliers.length < count) {
    const additionalMultipliers = shuffleArray([...multipliers])
    selectedMultipliers.push(...additionalMultipliers.slice(0, count - selectedMultipliers.length))
  }

  // Create questions
  return selectedMultipliers.map((multiplier, index) => ({
    id: `${table}-${multiplier}-${index}`,
    table,
    multiplier,
    correctAnswer: table * multiplier,
  }))
}
