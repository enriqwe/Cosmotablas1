import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, userName, tableNumber, timeMs, errors, points } = req.body || {}

  // Validate required fields
  if (!userId || !userName || !tableNumber || timeMs == null || errors == null || points == null) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (tableNumber < 2 || tableNumber > 9) {
    return res.status(400).json({ error: 'Invalid table number' })
  }

  if (typeof userName !== 'string' || userName.length > 15 || userName.length < 1) {
    return res.status(400).json({ error: 'Invalid user name' })
  }

  // Recompute points server-side to prevent cheating
  const serverPoints = Math.round(timeMs / 1000) + errors * 5
  if (serverPoints !== points) {
    return res.status(400).json({ error: 'Points mismatch' })
  }

  // Reject obviously impossible times (less than 3 seconds)
  if (timeMs < 3000) {
    return res.status(400).json({ error: 'Invalid time' })
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      INSERT INTO global_records (user_id, user_name, table_number, time_ms, errors, points)
      VALUES (${userId}, ${userName.substring(0, 15)}, ${tableNumber}, ${timeMs}, ${errors}, ${serverPoints})
      RETURNING id
    `
    return res.status(201).json({ success: true, id: result[0].id })
  } catch (error) {
    console.error('Failed to insert record:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
