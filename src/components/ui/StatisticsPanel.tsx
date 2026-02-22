import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { useRecordsStore, type TableRecord } from '@/store/recordsStore'
import { useMistakesStore, type MistakeEntry } from '@/store/mistakesStore'
import { useUserStore } from '@/store/userStore'
import { fetchGlobalLeaderboard, fetchTableLeaderboard, fetchGlobalMistakes } from '@/services/leaderboardApi'
import { CHALLENGE_TABLE } from '@/constants/config'

interface StatisticsPanelProps {
  isOpen: boolean
  onClose: () => void
  onStartChallenge?: (source: 'local' | 'global') => void
}

const PLANET_NAMES: Record<number, string> = {
  1: 'Mercurio',
  2: 'Venus',
  3: 'Tierra',
  4: 'Marte',
  5: 'Júpiter',
  6: 'Saturno',
  7: 'Urano',
  8: 'Neptuno',
}

const PLANET_COLORS: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-cyan-500',
  6: 'bg-blue-500',
  7: 'bg-violet-500',
  8: 'bg-pink-500',
}

// Hex colors for SVG donut chart (matching PLANET_COLORS)
const PLANET_HEX: Record<number, string> = {
  0: '#f59e0b', // amber-500 (desafío)
  2: '#ef4444', // red-500
  3: '#f97316', // orange-500
  4: '#eab308', // yellow-500
  5: '#22c55e', // green-500
  6: '#06b6d4', // cyan-500
  7: '#3b82f6', // blue-500
  8: '#8b5cf6', // violet-500
  9: '#ec4899', // pink-500
}

type TabType = 'progress' | 'records' | 'mejora'
type DataSource = 'local' | 'global'

function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const hours = d.getHours().toString().padStart(2, '0')
  const mins = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month} ${hours}:${mins}`
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number): string {
  const sweep = endAngle - startAngle
  // Clamp near-full arcs to avoid rendering glitches
  const clampedEnd = sweep >= 359.99 ? startAngle + 359.99 : endAngle
  const largeArc = sweep > 180 ? 1 : 0
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerR, clampedEnd)
  const innerStart = polarToCartesian(cx, cy, innerR, clampedEnd)
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle)

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ')
}

function getMedal(position: number): string {
  switch (position) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return `${position}º`
  }
}

export function StatisticsPanel({ isOpen, onClose, onStartChallenge }: StatisticsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('records')
  const [expandedTable, setExpandedTable] = useState<number | null>(null)
  const [dataSource, setDataSource] = useState<DataSource>('local')
  const [globalRecords, setGlobalRecords] = useState<Record<number, TableRecord[]>>({})
  const [globalAllRecords, setGlobalAllRecords] = useState<Record<number, TableRecord[]>>({})
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [mejoraSource, setMejoraSource] = useState<DataSource>('local')
  const [globalMistakes, setGlobalMistakes] = useState<MistakeEntry[]>([])
  const [isLoadingMistakes, setIsLoadingMistakes] = useState(false)
  const [mistakesError, setMistakesError] = useState<string | null>(null)
  const [drillDownTable, setDrillDownTable] = useState<number | null>(null)

  const planets = useGameStore((state) => state.planets)
  const totalStars = useGameStore((state) => state.totalStars)
  const { records, getTopRecordsByPoints, getAllTopRecordsByPoints } = useRecordsStore()
  const currentUserId = useUserStore((state) => state.currentUserId)
  const getUserTopMistakes = useMistakesStore((state) => state.getUserTopMistakes)

  const maxStars = planets.length * 5
  const completedPlanets = planets.filter((p) => p.status === 'completed').length
  const progressPercent = Math.round((completedPlanets / planets.length) * 100)

  // Speed stats per table for current user
  const speedStats = useMemo(() => {
    if (!currentUserId) return []
    const TABLES = [2, 3, 4, 5, 6, 7, 8, 9]
    return TABLES.map((table) => {
      const userRecords = (records[table] || []).filter((r) => r.userId === currentUserId)
      if (userRecords.length === 0) return null
      const avgTimeMs = userRecords.reduce((sum, r) => sum + r.timeMs, 0) / userRecords.length
      const avgPoints = userRecords.reduce((sum, r) => sum + r.points, 0) / userRecords.length
      return { table, avgTimeMs, avgPerQuestion: avgTimeMs / 8, avgPoints, count: userRecords.length }
    }).filter(Boolean) as { table: number; avgTimeMs: number; avgPerQuestion: number; avgPoints: number; count: number }[]
  }, [records, currentUserId])

  // Evolution data: all user records across tables, sorted by date
  const evolutionData = useMemo(() => {
    if (!currentUserId) return []
    const allUserRecords: { date: number; points: number; table: number }[] = []
    for (const tableRecords of Object.values(records)) {
      for (const r of tableRecords) {
        if (r.userId === currentUserId) {
          allUserRecords.push({ date: r.date, points: r.points, table: r.tableNumber })
        }
      }
    }
    return allUserRecords.sort((a, b) => a.date - b.date)
  }, [records, currentUserId])

  // Challenge stats for current user
  const challengeStats = useMemo(() => {
    if (!currentUserId) return null
    const challengeRecords = (records[CHALLENGE_TABLE] || []).filter((r) => r.userId === currentUserId)
    if (challengeRecords.length === 0) return null

    const totalAttempts = challengeRecords.length
    const avgPoints = Math.round(challengeRecords.reduce((s, r) => s + r.points, 0) / totalAttempts)
    const bestPoints = Math.min(...challengeRecords.map((r) => r.points))
    const localCount = challengeRecords.filter((r) => r.challengeSource !== 'global').length
    const globalCount = challengeRecords.filter((r) => r.challengeSource === 'global').length

    return { totalAttempts, avgPoints, bestPoints, localCount, globalCount }
  }, [records, currentUserId])

  // Unique tables present in evolution data (for legend)
  const evolutionTables = useMemo(() => {
    return [...new Set(evolutionData.map((d) => d.table))].sort((a, b) => a - b)
  }, [evolutionData])

  // Drill-down data for a specific table
  const drillDownData = useMemo(() => {
    if (drillDownTable === null) return []
    return evolutionData.filter((d) => d.table === drillDownTable)
  }, [evolutionData, drillDownTable])

  // Improvement % (last 7 days vs 8-21 days ago)
  const improvement = useMemo(() => {
    if (evolutionData.length < 2) return null
    const now = Date.now()
    const DAY = 86400000
    const recent = evolutionData.filter((d) => d.date >= now - 7 * DAY)
    const older = evolutionData.filter((d) => d.date >= now - 21 * DAY && d.date < now - 7 * DAY)
    if (recent.length === 0 || older.length === 0) return null
    const recentAvg = recent.reduce((s, d) => s + d.points, 0) / recent.length
    const olderAvg = older.reduce((s, d) => s + d.points, 0) / older.length
    const pct = ((olderAvg - recentAvg) / olderAvg) * 100
    return { pct: Math.round(pct), recentAvg, olderAvg }
  }, [evolutionData])

  // Fetch global data when switching to global view
  useEffect(() => {
    if (isOpen && activeTab === 'records' && dataSource === 'global') {
      setIsLoadingGlobal(true)
      setGlobalError(null)
      fetchGlobalLeaderboard()
        .then(setGlobalRecords)
        .catch(() => setGlobalError('Error al cargar datos globales'))
        .finally(() => setIsLoadingGlobal(false))
    }
  }, [isOpen, activeTab, dataSource])

  // Fetch global mistakes when switching to global view on Mejora tab
  useEffect(() => {
    if (isOpen && activeTab === 'mejora' && mejoraSource === 'global') {
      setIsLoadingMistakes(true)
      setMistakesError(null)
      fetchGlobalMistakes()
        .then(setGlobalMistakes)
        .catch(() => setMistakesError('Error al cargar datos globales'))
        .finally(() => setIsLoadingMistakes(false))
    }
  }, [isOpen, activeTab, mejoraSource])

  // Reset global state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setGlobalAllRecords({})
      setGlobalError(null)
      setGlobalMistakes([])
      setMistakesError(null)
      setDrillDownTable(null)
    }
  }, [isOpen])

  const handleTableExpand = useCallback((table: number) => {
    const newExpanded = expandedTable === table ? null : table
    setExpandedTable(newExpanded)

    // Fetch detailed global records when expanding in global mode
    if (newExpanded !== null && dataSource === 'global' && !globalAllRecords[newExpanded]) {
      fetchTableLeaderboard(newExpanded, 'all')
        .then((records) => {
          setGlobalAllRecords((prev) => ({ ...prev, [newExpanded]: records }))
        })
        .catch(() => {})
    }
  }, [expandedTable, dataSource, globalAllRecords])

  const renderStars = (count: number) => {
    return (
      <span className="text-xs">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= count ? 'text-yellow-400' : 'text-gray-600'}
          >
            ★
          </span>
        ))}
      </span>
    )
  }

  const renderRecordsList = (
    getBestFn: (table: number) => TableRecord[],
    getAllFn: (table: number) => TableRecord[],
  ) => {
    const TABLE_LIST = [CHALLENGE_TABLE, 2, 3, 4, 5, 6, 7, 8, 9]
    const hasAnyRecords = TABLE_LIST.some((t) => getBestFn(t).length > 0)

    if (!hasAnyRecords) {
      return (
        <div className="text-center text-white/50 py-8">
          <p className="text-4xl mb-2">{dataSource === 'global' ? '🌍' : '🏆'}</p>
          <p>{dataSource === 'global' ? '¡Aún no hay récords globales!' : '¡Aún no hay récords!'}</p>
          <p className="text-sm">Completa tablas para aparecer aquí</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {TABLE_LIST.map((table) => {
          const isExpanded = expandedTable === table
          const records = isExpanded ? getAllFn(table) : getBestFn(table)
          if (records.length === 0) return null

          const isChallenge = table === CHALLENGE_TABLE

          return (
            <div key={table} className="bg-space-dark rounded-xl p-3">
              {/* Table header - clickable */}
              <button
                className="flex items-center gap-2 mb-2 w-full text-left"
                onClick={() => handleTableExpand(table)}
              >
                {isChallenge ? (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-warning to-orange-600">
                    ⚡
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${PLANET_COLORS[table - 1]}`}>
                    {table}
                  </div>
                )}
                <span className="text-white font-medium text-sm flex-1">
                  {isChallenge ? 'Desafío' : `Tabla del ${table}`}
                </span>
                <span className="text-white/40 text-xs">
                  {isExpanded ? '▲ Mejores tiempos' : '▼ Ver detalle'}
                </span>
              </button>

              {/* Column headers */}
              <div className="flex items-center gap-1 text-[10px] text-white/40 mb-1 pl-7 pr-1">
                <span className="w-5 text-center shrink-0">#</span>
                <span className="flex-1">Jugador</span>
                <span className="w-10 text-right">Tiempo</span>
                <span className="w-9 text-right">Penal</span>
                <span className="w-10 text-right">Total</span>
                <span className="w-[52px] text-right">Fecha</span>
              </div>

              {/* Records list */}
              <div className="space-y-0.5">
                {records.map((record: TableRecord, index: number) => {
                  const penaltySeconds = record.errors * 5
                  const timeSeconds = Math.round(record.timeMs / 1000)
                  return (
                    <div
                      key={`${record.userId}-${record.date}-${index}`}
                      className={`flex items-center gap-1 text-xs rounded-md px-1 py-1 ${
                        index === 0 ? 'bg-gold/10' : ''
                      }`}
                    >
                      <span className="w-5 text-center shrink-0">{getMedal(index + 1)}</span>
                      <span className="flex-1 text-white/80 truncate font-medium">
                        {record.userName}
                        {isChallenge && record.challengeSource && (
                          <span className={`ml-1 text-[8px] px-1 rounded ${
                            record.challengeSource === 'global'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {record.challengeSource === 'global' ? '🌍' : '📱'}
                          </span>
                        )}
                      </span>
                      <span className="w-10 text-right text-white/50 font-mono text-[10px]">
                        {timeSeconds}s
                      </span>
                      <span className="w-9 text-right text-warning/70 font-mono text-[10px]">
                        {penaltySeconds > 0 ? `+${penaltySeconds}s` : '-'}
                      </span>
                      <span className="w-10 text-right text-white font-mono text-[10px] font-semibold">
                        {record.points}s
                      </span>
                      <span className="w-[52px] text-right text-white/35 text-[10px]">
                        {formatDate(record.date)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderRecords = () => {
    if (dataSource === 'global') {
      if (isLoadingGlobal) {
        return (
          <div className="text-center text-white/50 py-8">
            <motion.p
              className="text-4xl mb-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🌍
            </motion.p>
            <p>Cargando ranking global...</p>
          </div>
        )
      }
      if (globalError) {
        return (
          <div className="text-center text-white/50 py-8">
            <p className="text-4xl mb-2">⚠️</p>
            <p>{globalError}</p>
            <button
              onClick={() => setDataSource('local')}
              className="text-space-blue text-sm mt-2 underline"
            >
              Ver récords locales
            </button>
          </div>
        )
      }
      return renderRecordsList(
        (table) => globalRecords[table] || [],
        (table) => globalAllRecords[table] || globalRecords[table] || [],
      )
    }

    // Local mode
    return renderRecordsList(
      (table) => getTopRecordsByPoints(table, 10),
      (table) => getAllTopRecordsByPoints(table, 10),
    )
  }

  const renderMistakesList = (mistakes: MistakeEntry[]) => {
    if (mistakes.length === 0) {
      return (
        <div className="text-center text-white/50 py-8">
          <p className="text-4xl mb-2">{mejoraSource === 'global' ? '🌍' : '🎯'}</p>
          <p>{mejoraSource === 'global' ? '¡Aún no hay datos globales!' : '¡Sin errores registrados!'}</p>
          <p className="text-sm mt-1">Los errores aparecerán aquí al jugar</p>
        </div>
      )
    }

    const maxCount = mistakes[0].count

    return (
      <div className="space-y-2">
        {mistakes.map((m, i) => {
          const barWidth = Math.max(10, Math.round((m.count / maxCount) * 100))
          return (
            <motion.div
              key={`${m.table}x${m.multiplier}`}
              className="bg-space-dark rounded-xl p-3 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${PLANET_COLORS[m.table - 1]}`}>
                {m.table}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">
                  {m.table} × {m.multiplier} = ?
                </p>
                <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-warning rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-warning font-bold text-sm">{m.count}</p>
                <p className="text-white/40 text-[10px]">{m.count === 1 ? 'error' : 'errores'}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  const renderDonutChart = (mistakes: MistakeEntry[]) => {
    if (mistakes.length === 0) return null

    // Group by table, sum counts
    const byTable: Record<number, number> = {}
    for (const m of mistakes) {
      byTable[m.table] = (byTable[m.table] || 0) + m.count
    }

    const entries = Object.entries(byTable)
      .map(([table, count]) => ({ table: Number(table), count }))
      .sort((a, b) => b.count - a.count)

    const total = entries.reduce((s, e) => s + e.count, 0)
    if (total === 0) return null

    // SVG donut parameters
    const size = 140
    const cx = size / 2
    const cy = size / 2
    const outerR = 60
    const innerR = 38

    // Build arc paths
    let startAngle = -90 // start at top
    const arcs = entries.map((entry) => {
      const sweep = (entry.count / total) * 360
      const endAngle = startAngle + sweep
      const path = describeArc(cx, cy, outerR, innerR, startAngle, endAngle)
      startAngle = endAngle
      return { ...entry, path, percent: Math.round((entry.count / total) * 100) }
    })

    return (
      <div className="flex flex-col items-center mb-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc) => (
            <path
              key={arc.table}
              d={arc.path}
              fill={PLANET_HEX[arc.table] || '#6b7280'}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
          ))}
          {/* Center label */}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
            {total}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">
            errores
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
          {arcs.map((arc) => (
            <div key={arc.table} className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: PLANET_HEX[arc.table] || '#6b7280' }}
              />
              <span className="text-white/70 text-[10px]">
                Tabla {arc.table} ({arc.percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getMejoraData = (): MistakeEntry[] => {
    if (mejoraSource === 'global') return globalMistakes
    return currentUserId ? getUserTopMistakes(currentUserId, 15) : []
  }

  const renderMejora = () => {
    if (mejoraSource === 'global') {
      if (isLoadingMistakes) {
        return (
          <div className="text-center text-white/50 py-8">
            <motion.p
              className="text-4xl mb-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🌍
            </motion.p>
            <p>Cargando errores globales...</p>
          </div>
        )
      }
      if (mistakesError) {
        return (
          <div className="text-center text-white/50 py-8">
            <p className="text-4xl mb-2">⚠️</p>
            <p>{mistakesError}</p>
            <button
              onClick={() => setMejoraSource('local')}
              className="text-space-blue text-sm mt-2 underline"
            >
              Ver mis errores
            </button>
          </div>
        )
      }
    }

    const mistakes = getMejoraData()

    return (
      <>
        {/* Donut chart */}
        {renderDonutChart(mistakes)}

        {/* Challenge button */}
        {onStartChallenge && mistakes.length >= 3 && (
          <motion.button
            onClick={() => onStartChallenge(mejoraSource)}
            className="w-full py-3 mb-4 rounded-xl text-sm font-bold bg-gradient-to-r from-warning to-orange-600 text-white shadow-lg shadow-warning/20"
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚡ {mejoraSource === 'local' ? 'Desafío: Mis Errores' : 'Desafío: Errores Globales'}
          </motion.button>
        )}

        {/* Bar list */}
        {renderMistakesList(mistakes)}
      </>
    )
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'records', label: 'Récords', icon: '🏆' },
    { id: 'progress', label: 'Progreso', icon: '📈' },
    { id: 'mejora', label: 'Mejora', icon: '🎯' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-space-navy rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden border-2 border-space-purple/30 flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-gold">Estadísticas</h2>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 bg-space-dark rounded-full flex items-center justify-center text-white/60 hover:text-white"
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setDrillDownTable(null) }}
                    className={`
                      flex-1 px-4 py-3 text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'text-gold border-b-2 border-gold bg-space-dark/30'
                        : 'text-white/60 hover:text-white/80'}
                    `}
                  >
                    <span className="mr-1.5">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'records' ? (
                    <motion.div
                      key="records"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {/* Local / Global toggle */}
                      <div className="flex justify-center mb-3">
                        <div className="bg-space-dark rounded-full p-0.5 flex">
                          <button
                            onClick={() => { setDataSource('local'); setExpandedTable(null) }}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              dataSource === 'local'
                                ? 'bg-space-blue text-white'
                                : 'text-white/50 hover:text-white/70'
                            }`}
                          >
                            Este dispositivo
                          </button>
                          <button
                            onClick={() => { setDataSource('global'); setExpandedTable(null) }}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              dataSource === 'global'
                                ? 'bg-space-purple text-white'
                                : 'text-white/50 hover:text-white/70'
                            }`}
                          >
                            Global 🌍
                          </button>
                        </div>
                      </div>

                      <p className="text-white/60 text-xs mb-3 text-center">
                        {dataSource === 'local'
                          ? 'Mejor por jugador · Toca una tabla para ver detalle'
                          : 'Ranking mundial · Toca una tabla para ver detalle'}
                      </p>

                      {renderRecords()}
                    </motion.div>
                  ) : activeTab === 'progress' ? (
                    <motion.div
                      key="progress"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-space-dark rounded-xl p-3 text-center">
                          <p className="text-white/60 text-xs mb-1">Estrellas</p>
                          <p className="text-xl font-bold text-yellow-400">
                            {totalStars} / {maxStars}
                          </p>
                        </div>
                        <div className="bg-space-dark rounded-xl p-3 text-center">
                          <p className="text-white/60 text-xs mb-1">Progreso</p>
                          <p className="text-xl font-bold text-space-blue">
                            {progressPercent}%
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 bg-space-dark rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-space-blue to-space-purple"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="text-center text-white/50 text-xs mt-1">
                          {completedPlanets} de {planets.length} planetas
                        </p>
                      </div>

                      {/* Planet List */}
                      <div className="space-y-2">
                        {planets.map((planet) => (
                          <motion.div
                            key={planet.id}
                            className="flex items-center gap-3 bg-space-dark rounded-xl p-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: planet.id * 0.03 }}
                          >
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                planet.status === 'locked'
                                  ? 'bg-gray-600'
                                  : PLANET_COLORS[planet.id]
                              }`}
                            >
                              {planet.status === 'locked' ? '🔒' : planet.table}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">
                                {PLANET_NAMES[planet.id]}
                              </p>
                              <p className="text-white/50 text-xs">
                                Tabla del {planet.table}
                              </p>
                            </div>

                            <div className="text-right">
                              {planet.status === 'completed' ? (
                                <>
                                  {renderStars(planet.stars)}
                                  <p className="text-white/50 text-xs">
                                    {planet.bestAccuracy}%
                                  </p>
                                </>
                              ) : planet.status === 'unlocked' ? (
                                <span className="text-space-blue text-xs">
                                  Disponible
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs">
                                  Bloqueado
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Speed Stats per Table */}
                      {speedStats.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-white/70 text-sm font-semibold mb-3">Velocidad media por tabla</h3>
                          <div className="space-y-1.5">
                            {speedStats.map((stat) => {
                              const avgSec = Math.round(stat.avgTimeMs / 1000)
                              const perQ = (stat.avgPerQuestion / 1000).toFixed(1)
                              return (
                                <div key={stat.table} className="flex items-center gap-2 bg-space-dark rounded-lg px-3 py-2">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${PLANET_COLORS[stat.table - 1]}`}>
                                    {stat.table}
                                  </div>
                                  <span className="text-white/80 text-sm flex-1">Tabla del {stat.table}</span>
                                  <div className="text-right">
                                    <span className="text-white font-mono text-sm">{avgSec}s</span>
                                    <span className="text-white/40 text-[10px] ml-1">({perQ}s/preg)</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Challenge Stats */}
                      {challengeStats && (
                        <div className="mt-6">
                          <h3 className="text-white/70 text-sm font-semibold mb-3">Desafío</h3>
                          <div className="bg-space-dark rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-warning to-orange-600">
                                ⚡
                              </div>
                              <span className="text-white font-medium text-sm">Modo Desafío</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <p className="text-white/50 text-[10px]">Partidas</p>
                                <p className="text-white font-bold text-sm">{challengeStats.totalAttempts}</p>
                              </div>
                              <div>
                                <p className="text-white/50 text-[10px]">Mejor</p>
                                <p className="text-gold font-bold text-sm">{challengeStats.bestPoints}s</p>
                              </div>
                              <div>
                                <p className="text-white/50 text-[10px]">Media</p>
                                <p className="text-white font-bold text-sm">{challengeStats.avgPoints}s</p>
                              </div>
                            </div>
                            {(challengeStats.localCount > 0 || challengeStats.globalCount > 0) && (
                              <div className="flex justify-center gap-3 mt-2 text-[10px] text-white/40">
                                {challengeStats.localCount > 0 && <span>📱 {challengeStats.localCount} local</span>}
                                {challengeStats.globalCount > 0 && <span>🌍 {challengeStats.globalCount} global</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Evolution Chart / Drill-Down */}
                      <AnimatePresence mode="wait">
                        {drillDownTable !== null && drillDownData.length > 0 ? (
                          <motion.div
                            key={`drilldown-${drillDownTable}`}
                            className="mt-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                          >
                            {/* Drill-down header */}
                            <div className="flex items-center gap-2 mb-3">
                              <motion.button
                                onClick={() => setDrillDownTable(null)}
                                className="w-7 h-7 bg-space-dark rounded-full flex items-center justify-center text-white/60 hover:text-white"
                                whileTap={{ scale: 0.9 }}
                              >
                                ←
                              </motion.button>
                              <span
                                className="w-3 h-3 rounded-full inline-block"
                                style={{ backgroundColor: PLANET_HEX[drillDownTable] || '#fbbf24' }}
                              />
                              <h3 className="text-white/70 text-sm font-semibold">
                                {drillDownTable === CHALLENGE_TABLE ? 'Desafío' : `Tabla del ${drillDownTable}`}
                              </h3>
                              <span className="text-white/40 text-[10px] ml-auto">{drillDownData.length} intentos</span>
                            </div>

                            <div className="bg-space-dark rounded-xl p-3">
                              <svg viewBox="0 0 300 160" className="w-full" preserveAspectRatio="xMidYMid meet">
                                {(() => {
                                  const pad = { top: 15, right: 15, bottom: 30, left: 35 }
                                  const w = 300 - pad.left - pad.right
                                  const h = 160 - pad.top - pad.bottom
                                  const count = drillDownData.length
                                  const allPts = drillDownData.map((d) => d.points)
                                  const minPts = Math.min(...allPts)
                                  const maxPts = Math.max(...allPts)
                                  const ptsRange = maxPts - minPts || 1
                                  const tableColor = PLANET_HEX[drillDownTable] || '#fbbf24'

                                  const toX = (index: number) => pad.left + (index / Math.max(count - 1, 1)) * w
                                  const toY = (pts: number) => pad.top + ((pts - minPts) / ptsRange) * h

                                  const linePoints = drillDownData.map((d, i) => `${toX(i)},${toY(d.points)}`).join(' ')

                                  const yLabels = [minPts, Math.round((minPts + maxPts) / 2), maxPts]
                                  const fmtShort = (ts: number) => {
                                    const dt = new Date(ts)
                                    return `${dt.getDate()}/${dt.getMonth() + 1}`
                                  }

                                  // Linear regression for trend line
                                  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
                                  drillDownData.forEach((d, i) => {
                                    sumX += i; sumY += d.points; sumXY += i * d.points; sumX2 += i * i
                                  })
                                  const slope = count > 1 ? (count * sumXY - sumX * sumY) / (count * sumX2 - sumX * sumX) : 0
                                  const intercept = (sumY - slope * sumX) / count
                                  const trendStart = intercept
                                  const trendEnd = intercept + slope * (count - 1)

                                  return (
                                    <>
                                      {/* Grid lines */}
                                      {yLabels.map((pts) => (
                                        <line key={pts} x1={pad.left} x2={300 - pad.right} y1={toY(pts)} y2={toY(pts)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                                      ))}
                                      {/* Y-axis labels */}
                                      {yLabels.map((pts) => (
                                        <text key={`label-${pts}`} x={pad.left - 4} y={toY(pts) + 3} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="end">{pts}s</text>
                                      ))}
                                      {/* X-axis date labels */}
                                      <text x={pad.left} y={160 - 4} fill="rgba(255,255,255,0.35)" fontSize="8">
                                        {fmtShort(drillDownData[0].date)}
                                      </text>
                                      <text x={300 - pad.right} y={160 - 4} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="end">
                                        {fmtShort(drillDownData[drillDownData.length - 1].date)}
                                      </text>
                                      <text x={150} y={160 - 4} fill="rgba(255,255,255,0.25)" fontSize="7" textAnchor="middle">
                                        {count} intentos
                                      </text>
                                      {/* Trend line (dashed) */}
                                      {count > 1 && (
                                        <line
                                          x1={toX(0)} y1={toY(trendStart)}
                                          x2={toX(count - 1)} y2={toY(trendEnd)}
                                          stroke={tableColor}
                                          strokeWidth="1"
                                          strokeDasharray="4 2"
                                          opacity="0.4"
                                        />
                                      )}
                                      {/* Data line */}
                                      <polyline points={linePoints} fill="none" stroke={tableColor} strokeWidth="1.5" opacity="0.6" />
                                      {/* Data points */}
                                      {drillDownData.map((d, i) => (
                                        <circle
                                          key={i}
                                          cx={toX(i)}
                                          cy={toY(d.points)}
                                          r="3.5"
                                          fill={tableColor}
                                          stroke="rgba(0,0,0,0.3)"
                                          strokeWidth="0.5"
                                        />
                                      ))}
                                    </>
                                  )
                                })()}
                              </svg>

                              {/* Stats summary */}
                              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                                <div>
                                  <p className="text-white/40 text-[10px]">Mejor</p>
                                  <p className="text-gold font-bold text-xs">{Math.min(...drillDownData.map((d) => d.points))}s</p>
                                </div>
                                <div>
                                  <p className="text-white/40 text-[10px]">Media</p>
                                  <p className="text-white font-bold text-xs">
                                    {Math.round(drillDownData.reduce((s, d) => s + d.points, 0) / drillDownData.length)}s
                                  </p>
                                </div>
                                <div>
                                  <p className="text-white/40 text-[10px]">Último</p>
                                  <p className="text-white font-bold text-xs">{drillDownData[drillDownData.length - 1].points}s</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : evolutionData.length >= 2 ? (
                          <motion.div
                            key="overview"
                            className="mt-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                          >
                            <h3 className="text-white/70 text-sm font-semibold mb-3">Tu evolución</h3>
                            <div className="bg-space-dark rounded-xl p-3">
                              <svg viewBox="0 0 300 140" className="w-full" preserveAspectRatio="xMidYMid meet">
                                {(() => {
                                  const pad = { top: 15, right: 15, bottom: 25, left: 35 }
                                  const w = 300 - pad.left - pad.right
                                  const h = 140 - pad.top - pad.bottom
                                  const minDate = evolutionData[0].date
                                  const maxDate = evolutionData[evolutionData.length - 1].date
                                  const dateRange = maxDate - minDate || 1
                                  const allPts = evolutionData.map((d) => d.points)
                                  const minPts = Math.min(...allPts)
                                  const maxPts = Math.max(...allPts)
                                  const ptsRange = maxPts - minPts || 1

                                  const toX = (date: number) => pad.left + ((date - minDate) / dateRange) * w
                                  const toY = (pts: number) => pad.top + ((pts - minPts) / ptsRange) * h

                                  const linePoints = evolutionData.map((d) => `${toX(d.date)},${toY(d.points)}`).join(' ')

                                  const yLabels = [minPts, Math.round((minPts + maxPts) / 2), maxPts]
                                  const fmtShort = (ts: number) => {
                                    const d = new Date(ts)
                                    return `${d.getDate()}/${d.getMonth() + 1}`
                                  }

                                  return (
                                    <>
                                      {/* Grid lines */}
                                      {yLabels.map((pts) => (
                                        <line key={pts} x1={pad.left} x2={300 - pad.right} y1={toY(pts)} y2={toY(pts)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                                      ))}
                                      {/* Y-axis labels */}
                                      {yLabels.map((pts) => (
                                        <text key={`label-${pts}`} x={pad.left - 4} y={toY(pts) + 3} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="end">{pts}s</text>
                                      ))}
                                      {/* X-axis labels */}
                                      <text x={pad.left} y={140 - 4} fill="rgba(255,255,255,0.35)" fontSize="8">{fmtShort(minDate)}</text>
                                      <text x={300 - pad.right} y={140 - 4} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="end">{fmtShort(maxDate)}</text>
                                      {/* Trend line */}
                                      <polyline points={linePoints} fill="none" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" />
                                      {/* Hit targets (larger for touch) */}
                                      {evolutionData.map((d, i) => (
                                        <circle
                                          key={`hit-${i}`}
                                          cx={toX(d.date)}
                                          cy={toY(d.points)}
                                          r="8"
                                          fill="transparent"
                                          className="cursor-pointer"
                                          onClick={() => setDrillDownTable(d.table)}
                                        />
                                      ))}
                                      {/* Visible data points */}
                                      {evolutionData.map((d, i) => (
                                        <circle
                                          key={i}
                                          cx={toX(d.date)}
                                          cy={toY(d.points)}
                                          r="3"
                                          fill={PLANET_HEX[d.table] || '#fbbf24'}
                                          stroke="rgba(0,0,0,0.3)"
                                          strokeWidth="0.5"
                                          className="pointer-events-none"
                                        />
                                      ))}
                                    </>
                                  )
                                })()}
                              </svg>

                              {/* Legend */}
                              {evolutionTables.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
                                  {evolutionTables.map((table) => (
                                    <button
                                      key={table}
                                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                                      onClick={() => setDrillDownTable(table)}
                                    >
                                      <span
                                        className="w-2.5 h-2.5 rounded-full inline-block"
                                        style={{ backgroundColor: PLANET_HEX[table] || '#fbbf24' }}
                                      />
                                      <span className="text-white/70 text-[10px] underline decoration-dotted">
                                        {table === CHALLENGE_TABLE ? 'Desafío' : `Tabla ${table}`}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Improvement message */}
                              {improvement && (
                                <div className="text-center mt-2">
                                  {improvement.pct > 3 ? (
                                    <p className="text-success text-sm font-medium">
                                      ↑ {improvement.pct}% más rápido que hace 2 semanas
                                    </p>
                                  ) : improvement.pct < -3 ? (
                                    <p className="text-warning text-sm font-medium">
                                      ↓ {Math.abs(improvement.pct)}% más lento que hace 2 semanas
                                    </p>
                                  ) : (
                                    <p className="text-white/50 text-sm">
                                      Similar a hace 2 semanas
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : evolutionData.length > 0 ? (
                          <motion.div key="not-enough" className="mt-6 text-center text-white/40 text-xs py-3">
                            Juega más partidas para ver tu evolución
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mejora"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {/* Local / Global toggle */}
                      <div className="flex justify-center mb-3">
                        <div className="bg-space-dark rounded-full p-0.5 flex">
                          <button
                            onClick={() => setMejoraSource('local')}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              mejoraSource === 'local'
                                ? 'bg-space-blue text-white'
                                : 'text-white/50 hover:text-white/70'
                            }`}
                          >
                            Mis errores
                          </button>
                          <button
                            onClick={() => setMejoraSource('global')}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              mejoraSource === 'global'
                                ? 'bg-space-purple text-white'
                                : 'text-white/50 hover:text-white/70'
                            }`}
                          >
                            Global 🌍
                          </button>
                        </div>
                      </div>

                      <p className="text-white/60 text-xs mb-3 text-center">
                        {mejoraSource === 'local'
                          ? 'Preguntas donde más fallas'
                          : 'Preguntas más difíciles para todos'}
                      </p>

                      {renderMejora()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
