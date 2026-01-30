import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Planet, StarLevel } from '@/types/game.types'
import { INITIAL_PLANETS } from '@/constants/planets'

// Per-user progress data
interface UserProgress {
  planets: Planet[]
  totalStars: number
}

interface GameStore {
  // Current user's data (loaded from userProgress)
  planets: Planet[]
  totalStars: number
  currentUserId: string | null
  // All users' progress
  userProgress: Record<string, UserProgress>
  // Actions
  setCurrentUser: (userId: string | null) => void
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
      currentUserId: null,
      userProgress: {},

      setCurrentUser: (userId: string | null) => {
        if (!userId) {
          set({ currentUserId: null, planets: INITIAL_PLANETS, totalStars: 0 })
          return
        }

        const state = get()
        const userProgress = state.userProgress[userId] || {
          planets: INITIAL_PLANETS,
          totalStars: 0,
        }

        set({
          currentUserId: userId,
          planets: userProgress.planets,
          totalStars: userProgress.totalStars,
        })
      },

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

          // Save to user progress if logged in
          const newUserProgress = state.currentUserId
            ? {
                ...state.userProgress,
                [state.currentUserId]: { planets: updatedPlanets, totalStars: newTotalStars },
              }
            : state.userProgress

          return { planets: updatedPlanets, totalStars: newTotalStars, userProgress: newUserProgress }
        })
      },

      getTotalStars: () => {
        return get().totalStars
      },

      getPlanet: (planetId: number) => {
        return get().planets.find((p) => p.id === planetId)
      },

      resetProgress: () => {
        set((state) => {
          // Reset current user's progress
          const newUserProgress = state.currentUserId
            ? {
                ...state.userProgress,
                [state.currentUserId]: { planets: INITIAL_PLANETS, totalStars: 0 },
              }
            : state.userProgress

          return {
            planets: INITIAL_PLANETS,
            totalStars: 0,
            userProgress: newUserProgress,
          }
        })
      },
    }),
    {
      name: 'cosmotablas-game-state',
      version: 1,
    }
  )
)
