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

interface RecordsStore {
  // All records indexed by table number
  records: Record<number, TableRecord[]>
  // Add a new record
  addRecord: (userId: string, userName: string, tableNumber: number, timeMs: number, errors: number) => void
  // Get top records for a table
  getTopRecordsByTime: (tableNumber: number, limit?: number) => TableRecord[]
  getTopRecordsByErrors: (tableNumber: number, limit?: number) => TableRecord[]
  getTopRecordsByPoints: (tableNumber: number, limit?: number) => TableRecord[]
  // Get all tables with records
  getTablesWithRecords: () => number[]
}

function calculatePoints(timeMs: number, errors: number): number {
  return Math.round(timeMs / 1000) + errors * 5
}

export const useRecordsStore = create<RecordsStore>()(
  persist(
    (set, get) => ({
      records: {},

      addRecord: (userId: string, userName: string, tableNumber: number, timeMs: number, errors: number) => {
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

        set((state) => {
          const tableRecords = state.records[tableNumber] || []

          // Check if this user already has a record for this table
          const existingIndex = tableRecords.findIndex((r) => r.userId === userId)

          let updatedRecords: TableRecord[]
          if (existingIndex !== -1) {
            // User has an existing record - only update if new one is better (lower points)
            const existing = tableRecords[existingIndex]
            if (points < existing.points) {
              updatedRecords = [
                ...tableRecords.slice(0, existingIndex),
                newRecord,
                ...tableRecords.slice(existingIndex + 1),
              ]
            } else {
              // Keep existing record
              updatedRecords = tableRecords
            }
          } else {
            // New record for this user
            updatedRecords = [...tableRecords, newRecord]
          }

          return {
            records: {
              ...state.records,
              [tableNumber]: updatedRecords,
            },
          }
        })
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
