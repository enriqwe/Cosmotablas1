import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MistakeEntry {
  table: number
  multiplier: number
  count: number
}

interface MistakesStore {
  // userId → "tableXmultiplier" → count
  userMistakes: Record<string, Record<string, number>>
  addMistakes: (userId: string, mistakes: { table: number; multiplier: number }[]) => void
  getUserTopMistakes: (userId: string, limit?: number) => MistakeEntry[]
}

function makeKey(table: number, multiplier: number): string {
  return `${table}x${multiplier}`
}

function parseKey(key: string): { table: number; multiplier: number } {
  const [table, multiplier] = key.split('x').map(Number)
  return { table, multiplier }
}

export const useMistakesStore = create<MistakesStore>()(
  persist(
    (set, get) => ({
      userMistakes: {},

      addMistakes: (userId: string, mistakes: { table: number; multiplier: number }[]) => {
        set((state) => {
          const userMap = { ...(state.userMistakes[userId] || {}) }
          for (const m of mistakes) {
            const key = makeKey(m.table, m.multiplier)
            userMap[key] = (userMap[key] || 0) + 1
          }
          return {
            userMistakes: {
              ...state.userMistakes,
              [userId]: userMap,
            },
          }
        })
      },

      getUserTopMistakes: (userId: string, limit = 10): MistakeEntry[] => {
        const userMap = get().userMistakes[userId]
        if (!userMap) return []

        return Object.entries(userMap)
          .map(([key, count]) => ({ ...parseKey(key), count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit)
      },
    }),
    {
      name: 'cosmotablas-mistakes',
      version: 1,
    }
  )
)
