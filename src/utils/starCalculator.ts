import type { StarLevel } from '@/types/game.types'

export function calculateStars(accuracy: number): StarLevel {
  if (accuracy >= 100) return 5 // Perfect
  if (accuracy >= 95) return 4  // Excellent
  if (accuracy >= 85) return 3  // Very good
  if (accuracy >= 70) return 2  // Good
  return 1                      // Completed
}
