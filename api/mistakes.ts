import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = neon(process.env.DATABASE_URL!)

  if (req.method === 'POST') {
    const { mistakes } = req.body || {}

    if (!Array.isArray(mistakes) || mistakes.length === 0) {
      return res.status(400).json({ error: 'Missing mistakes array' })
    }

    // Validate and cap at 20 entries per request
    const valid = mistakes.slice(0, 20).filter(
      (m: { table?: number; multiplier?: number }) =>
        typeof m.table === 'number' &&
        typeof m.multiplier === 'number' &&
        m.table >= 2 && m.table <= 9 &&
        m.multiplier >= 2 && m.multiplier <= 9
    )

    if (valid.length === 0) {
      return res.status(400).json({ error: 'No valid mistakes' })
    }

    try {
      for (const m of valid) {
        await sql`
          INSERT INTO question_mistakes (table_number, multiplier, error_count)
          VALUES (${m.table}, ${m.multiplier}, 1)
          ON CONFLICT (table_number, multiplier)
          DO UPDATE SET error_count = question_mistakes.error_count + 1
        `
      }
      return res.status(200).json({ success: true, count: valid.length })
    } catch (error) {
      console.error('Failed to insert mistakes:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT table_number, multiplier, error_count
        FROM question_mistakes
        ORDER BY error_count DESC
        LIMIT 20
      `
      const mistakes = rows.map((r: Record<string, unknown>) => ({
        table: Number(r.table_number),
        multiplier: Number(r.multiplier),
        count: Number(r.error_count),
      }))
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
      return res.status(200).json({ mistakes })
    } catch (error) {
      console.error('Failed to fetch mistakes:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
