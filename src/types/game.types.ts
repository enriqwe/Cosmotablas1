export type PlanetStatus = 'locked' | 'unlocked' | 'completed'

export type StarLevel = 0 | 1 | 2 | 3

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
