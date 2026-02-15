import { useState, useEffect, useCallback } from 'react'
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

  const planets = useGameStore((state) => state.planets)
  const totalStars = useGameStore((state) => state.totalStars)
  const { getTopRecordsByPoints, getAllTopRecordsByPoints } = useRecordsStore()
  const currentUserId = useUserStore((state) => state.currentUserId)
  const getUserTopMistakes = useMistakesStore((state) => state.getUserTopMistakes)

  const maxStars = planets.length * 5
  const completedPlanets = planets.filter((p) => p.status === 'completed').length
  const progressPercent = Math.round((completedPlanets / planets.length) * 100)

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
                      <span className="flex-1 text-white/80 truncate font-medium">{record.userName}</span>
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
                    onClick={() => setActiveTab(tab.id)}
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
