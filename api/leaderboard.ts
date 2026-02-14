import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const tableParam = req.query.table
  const mode = (req.query.mode as string) || 'best'

  try {
    if (tableParam) {
      const tableNumber = Number(tableParam)
      if (isNaN(tableNumber) || tableNumber < 2 || tableNumber > 9) {
        return res.status(400).json({ error: 'Invalid table number' })
      }

      if (mode === 'all') {
        // All top 10 records (multiple per player allowed)
        const records = await sql`
          SELECT user_id, user_name, table_number, time_ms, errors, points,
                 EXTRACT(EPOCH FROM created_at) * 1000 AS date
          FROM global_records
          WHERE table_number = ${tableNumber}
          ORDER BY points ASC
          LIMIT 10
        `
        return res.status(200).json({ records })
      } else {
        // Best per player (top 10 players)
        const records = await sql`
          SELECT DISTINCT ON (user_id)
                 user_id, user_name, table_number, time_ms, errors, points,
                 EXTRACT(EPOCH FROM created_at) * 1000 AS date
          FROM global_records
          WHERE table_number = ${tableNumber}
          ORDER BY user_id, points ASC
        `
        const sorted = records.sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
          (a.points as number) - (b.points as number)
        ).slice(0, 10)
        return res.status(200).json({ records: sorted })
      }
    } else {
      // All tables: best per player for each
      const tables: Record<number, unknown[]> = {}
      for (let t = 2; t <= 9; t++) {
        const records = await sql`
          SELECT DISTINCT ON (user_id)
                 user_id, user_name, table_number, time_ms, errors, points,
                 EXTRACT(EPOCH FROM created_at) * 1000 AS date
          FROM global_records
          WHERE table_number = ${t}
          ORDER BY user_id, points ASC
        `
        const sorted = records.sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
          (a.points as number) - (b.points as number)
        ).slice(0, 10)
        if (sorted.length > 0) {
          tables[t] = sorted
        }
      }
      // Cache for 30 seconds
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
      return res.status(200).json({ tables })
    }
  } catch (error) {
    console.error('Leaderboard query failed:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
