import type { Planet } from '@/types/game.types'

const STORAGE_KEY = 'cosmotablas_game_state'
const STORAGE_VERSION = 1

interface PersistedState {
  version: number
  planets: Planet[]
  totalStars: number
}

export function saveGameState(planets: Planet[], totalStars: number): void {
  try {
    const state: PersistedState = {
      version: STORAGE_VERSION,
      planets,
      totalStars,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save game state:', error)
  }
}

export function loadGameState(): { planets: Planet[]; totalStars: number } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const state: PersistedState = JSON.parse(stored)

    // Version check for future migrations
    if (state.version !== STORAGE_VERSION) {
      console.warn('Game state version mismatch, resetting progress')
      return null
    }

    return {
      planets: state.planets,
      totalStars: state.totalStars,
    }
  } catch (error) {
    console.error('Failed to load game state:', error)
    return null
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear game state:', error)
  }
}
