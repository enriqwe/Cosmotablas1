import type { TableRecord } from '@/store/recordsStore'

const API_BASE = '/api'

interface ApiRecord {
  user_id: string
  user_name: string
  table_number: number
  time_ms: number
  errors: number
  points: number
  date: number
}

function mapToTableRecord(r: ApiRecord): TableRecord {
  return {
    userId: r.user_id,
    userName: r.user_name,
    tableNumber: r.table_number,
    timeMs: Number(r.time_ms),
    errors: Number(r.errors),
    points: Number(r.points),
    date: Number(r.date),
  }
}

/** Fire-and-forget: submit record to global leaderboard */
export async function submitGlobalRecord(record: {
  userId: string
  userName: string
  tableNumber: number
  timeMs: number
  errors: number
  points: number
}): Promise<void> {
  try {
    await fetch(`${API_BASE}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
  } catch {
    // Silent failure - global sync is best-effort
  }
}

/** Fetch global best-per-player records for all tables */
export async function fetchGlobalLeaderboard(): Promise<Record<number, TableRecord[]>> {
  const response = await fetch(`${API_BASE}/leaderboard`)
  if (!response.ok) throw new Error('Failed to load global leaderboard')
  const data = await response.json()

  const result: Record<number, TableRecord[]> = {}
  for (const [table, records] of Object.entries(data.tables || {})) {
    result[Number(table)] = (records as ApiRecord[]).map(mapToTableRecord)
  }
  return result
}

/** Fetch global records for a specific table */
export async function fetchTableLeaderboard(
  tableNumber: number,
  mode: 'best' | 'all' = 'best'
): Promise<TableRecord[]> {
  const response = await fetch(`${API_BASE}/leaderboard?table=${tableNumber}&mode=${mode}`)
  if (!response.ok) throw new Error('Failed to load table leaderboard')
  const data = await response.json()
  return (data.records as ApiRecord[]).map(mapToTableRecord)
}
