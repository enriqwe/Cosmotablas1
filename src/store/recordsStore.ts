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
  // All records indexed by table number
  records: Record<number, TableRecord[]>
  // Add a new record
  addRecord: (userId: string, userName: string, tableNumber: number, timeMs: number, errors: number) => RecordResult
  // Get user's position in points leaderboard (1-indexed, 0 if not found)
  getUserPosition: (tableNumber: number, userId: string) => number
  // Get all records sorted by points
  getAllRecordsByPoints: (tableNumber: number) => TableRecord[]
  // Get top records for a table
  getTopRecordsByTime: (tableNumber: number, limit?: number) => TableRecord[]
  getTopRecordsByErrors: (tableNumber: number, limit?: number) => TableRecord[]
  getTopRecordsByPoints: (tableNumber: number, limit?: number) => TableRecord[]
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
        const existingIndex = tableRecords.findIndex((r) => r.userId === userId)
        const existing = existingIndex !== -1 ? tableRecords[existingIndex] : null
        const isNewPersonalBest = !existing || points < existing.points

        set((state) => {
          const stateRecords = state.records[tableNumber] || []
          const idx = stateRecords.findIndex((r) => r.userId === userId)

          let updatedRecords: TableRecord[]
          if (idx !== -1) {
            if (isNewPersonalBest) {
              updatedRecords = [
                ...stateRecords.slice(0, idx),
                newRecord,
                ...stateRecords.slice(idx + 1),
              ]
            } else {
              updatedRecords = stateRecords
            }
          } else {
            updatedRecords = [...stateRecords, newRecord]
          }

          return {
            records: {
              ...state.records,
              [tableNumber]: updatedRecords,
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
        const sorted = [...tableRecords].sort((a, b) => a.points - b.points)
        const index = sorted.findIndex((r) => r.userId === userId)
        return index + 1 // 1-indexed, 0 if not found
      },

      getAllRecordsByPoints: (tableNumber: number) => {
        const tableRecords = get().records[tableNumber] || []
        return [...tableRecords].sort((a, b) => a.points - b.points)
      },

      getTopRecordsByTime: (tableNumber: number, limit = 3) => {
        const tableRecords = get().records[tableNumber] || []
        return [...tableRecords]
          .sort((a, b) => a.timeMs - b.timeMs)
          .slice(0, limit)
      },

      getTopRecordsByErrors: (tableNumber: number, limit = 3) => {
        const tableRecords = get().records[tableNumber] || []
        return [...tableRecords]
          .sort((a, b) => a.errors - b.errors || a.timeMs - b.timeMs)
          .slice(0, limit)
      },

      getTopRecordsByPoints: (tableNumber: number, limit = 3) => {
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
