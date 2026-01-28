import type { StarLevel } from '@/types/game.types'

export function calculateStars(accuracy: number): StarLevel {
  if (accuracy >= 95) return 3  // Gold
  if (accuracy >= 85) return 2  // Silver
  if (accuracy >= 70) return 1  // Bronze
  return 0                       // No stars
}
