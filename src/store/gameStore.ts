import { create } from 'zustand'
import type { Planet, StarLevel } from '@/types/game.types'
import { INITIAL_PLANETS } from '@/constants/planets'

interface GameStore {
  planets: Planet[]
  totalStars: number
  unlockPlanet: (planetId: number) => void
  updatePlanetStars: (planetId: number, stars: StarLevel, accuracy: number) => void
  getTotalStars: () => number
}

export const useGameStore = create<GameStore>((set, get) => ({
  planets: INITIAL_PLANETS,
  totalStars: 0,

  unlockPlanet: (planetId: number) => {
    set((state) => ({
      planets: state.planets.map((planet) =>
        planet.id === planetId
          ? { ...planet, status: 'unlocked' }
          : planet
      ),
    }))
  },

  updatePlanetStars: (planetId: number, stars: StarLevel, accuracy: number) => {
    set((state) => {
      const updatedPlanets = state.planets.map((planet) =>
        planet.id === planetId
          ? {
              ...planet,
              status: 'completed' as const,
              stars: Math.max(planet.stars, stars) as StarLevel,
              bestAccuracy: Math.max(planet.bestAccuracy, accuracy),
            }
          : planet
      )
      const newTotalStars = updatedPlanets.reduce((sum, p) => sum + p.stars, 0)
      return { planets: updatedPlanets, totalStars: newTotalStars }
    })
  },

  getTotalStars: () => {
    return get().totalStars
  },
}))
