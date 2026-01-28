import type { Planet } from '@/types/game.types'

export const PLANET_COUNT = 8

export const INITIAL_PLANETS: Planet[] = [
  { id: 1, table: 2, status: 'unlocked', stars: 0, bestAccuracy: 0 },
  { id: 2, table: 3, status: 'locked', stars: 0, bestAccuracy: 0 },
  { id: 3, table: 4, status: 'locked', stars: 0, bestAccuracy: 0 },
  { id: 4, table: 5, status: 'locked', stars: 0, bestAccuracy: 0 },
  { id: 5, table: 6, status: 'locked', stars: 0, bestAccuracy: 0 },
  { id: 6, table: 7, status: 'locked', stars: 0, bestAccuracy: 0 },
  { id: 7, table: 8, status: 'locked', stars: 0, bestAccuracy: 0 },
  { id: 8, table: 9, status: 'locked', stars: 0, bestAccuracy: 0 },
]
