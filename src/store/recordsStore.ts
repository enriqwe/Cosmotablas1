import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Record for a single table attempt
export interface TableRecord {
  userId: string
  userName: string
  tableNumber: number
  timeMs: number
  errors: number
  points: number // timeMs / 1000 + errors * 5
  date: number
}

export interface RecordResult {
  position: number // 1-indexed position in leaderboard
  totalRecords: number
  isNewPersonalBest: boolean
  isAbsoluteRecord: boolean
  points: number
}

interface RecordsStore {
  // All records indexed by table number (stores ALL attempts)
  records: Record<number, TableRecord[]>
  // Add a new record
  addRecord: (userId: string, userName: string, tableNumber: number, timeMs: number, errors: number) => RecordResult
  // Get user's position in best-per-player ranking (1-indexed, 0 if not found)
  getUserPosition: (tableNumber: number, userId: string) => number
  // Get best record per player, sorted by points
  getTopRecordsByPoints: (tableNumber: number, limit?: number) => TableRecord[]
  // Get all records sorted by points (multiple per player allowed)
  getAllTopRecordsByPoints: (tableNumber: number, limit?: number) => TableRecord[]
  // Get all tables with records
  getTablesWithRecords: () => number[]
}

export function calculatePoints(timeMs: number, errors: number): number {
  return Math.round(timeMs / 1000) + errors * 5
}

export const useRecordsStore = create<RecordsStore>()(
  persist(
    (set, get) => ({
      records: {},

      addRecord: (userId: string, userName: string, tableNumber: number, timeMs: number, errors: number): RecordResult => {
        const points = calculatePoints(timeMs, errors)
        const newRecord: TableRecord = {
          userId: userId,
          userName,
          tableNumber,
          timeMs,
          errors,
          points,
          date: Date.now(),
        }

        const tableRecords = get().records[tableNumber] || []
        const userRecords = tableRecords.filter((r) => r.userId === userId)
        const bestPersonalPoints = userRecords.length > 0
          ? Math.min(...userRecords.map((r) => r.points))
          : Infinity
        const isNewPersonalBest = points < bestPersonalPoints

        set((state) => {
          const stateRecords = [...(state.records[tableNumber] || []), newRecord]
          // Cap at 100 records per table to avoid unbounded growth
          const capped = stateRecords.length > 100
            ? stateRecords.sort((a, b) => a.points - b.points).slice(0, 100)
            : stateRecords

          return {
            records: {
              ...state.records,
              [tableNumber]: capped,
            },
          }
        })

        // Compute position after update
        const position = get().getUserPosition(tableNumber, userId)
        const totalRecords = (get().records[tableNumber] || []).length

        return {
          position,
          totalRecords,
          isNewPersonalBest,
          isAbsoluteRecord: position === 1,
          points,
        }
      },

      getUserPosition: (tableNumber: number, userId: string) => {
        const tableRecords = get().records[tableNumber] || []
        // Best per player ranking
        const bestByPlayer = new Map<string, TableRecord>()
        for (const record of tableRecords) {
          const existing = bestByPlayer.get(record.userId)
          if (!existing || record.points < existing.points) {
            bestByPlayer.set(record.userId, record)
          }
        }
        const sorted = [...bestByPlayer.values()].sort((a, b) => a.points - b.points)
        const index = sorted.findIndex((r) => r.userId === userId)
        return index + 1 // 1-indexed, 0 if not found
      },

      getTopRecordsByPoints: (tableNumber: number, limit = 3) => {
        const tableRecords = get().records[tableNumber] || []
        // Best record per player
        const bestByPlayer = new Map<string, TableRecord>()
        for (const record of tableRecords) {
          const existing = bestByPlayer.get(record.userId)
          if (!existing || record.points < existing.points) {
            bestByPlayer.set(record.userId, record)
          }
        }
        return [...bestByPlayer.values()]
          .sort((a, b) => a.points - b.points)
          .slice(0, limit)
      },

      getAllTopRecordsByPoints: (tableNumber: number, limit = 10) => {
        const tableRecords = get().records[tableNumber] || []
        return [...tableRecords]
          .sort((a, b) => a.points - b.points)
          .slice(0, limit)
      },

      getTablesWithRecords: () => {
        const records = get().records
        return Object.keys(records)
          .map(Number)
          .filter((t) => records[t].length > 0)
          .sort((a, b) => a - b)
      },
    }),
    {
      name: 'cosmotablas-records',
      version: 1,
    }
  )
)
