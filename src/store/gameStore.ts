import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Planet, StarLevel } from '@/types/game.types'
import { INITIAL_PLANETS } from '@/constants/planets'

interface GameStore {
  planets: Planet[]
  totalStars: number
  unlockPlanet: (planetId: number) => void
  updatePlanetStars: (planetId: number, stars: StarLevel, accuracy: number) => void
  getTotalStars: () => number
  getPlanet: (planetId: number) => Planet | undefined
  resetProgress: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      planets: INITIAL_PLANETS,
      totalStars: 0,

      unlockPlanet: (planetId: number) => {
        set((state) => ({
          planets: state.planets.map((planet) =>
            planet.id === planetId && planet.status === 'locked'
              ? { ...planet, status: 'unlocked' }
              : planet
          ),
        }))
      },

      updatePlanetStars: (planetId: number, stars: StarLevel, accuracy: number) => {
        set((state) => {
          // Update the completed planet
          let updatedPlanets = state.planets.map((planet) =>
            planet.id === planetId
              ? {
                  ...planet,
                  status: 'completed' as const,
                  stars: Math.max(planet.stars, stars) as StarLevel,
                  bestAccuracy: Math.max(planet.bestAccuracy, accuracy),
                }
              : planet
          )

          // Unlock next planet if stars > 0 (accuracy >= 70%)
          if (stars > 0) {
            const nextPlanetId = planetId + 1
            updatedPlanets = updatedPlanets.map((planet) =>
              planet.id === nextPlanetId && planet.status === 'locked'
                ? { ...planet, status: 'unlocked' }
                : planet
            )
          }

          const newTotalStars = updatedPlanets.reduce((sum, p) => sum + p.stars, 0)
          return { planets: updatedPlanets, totalStars: newTotalStars }
        })
      },

      getTotalStars: () => {
        return get().totalStars
      },

      getPlanet: (planetId: number) => {
        return get().planets.find((p) => p.id === planetId)
      },

      resetProgress: () => {
        set({
          planets: INITIAL_PLANETS,
          totalStars: 0,
        })
      },
    }),
    {
      name: 'cosmotablas-game-state',
      version: 1,
    }
  )
)
