import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { useRecordsStore, type TableRecord } from '@/store/recordsStore'

interface StatisticsPanelProps {
  isOpen: boolean
  onClose: () => void
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

type TabType = 'progress' | 'records'

function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const hours = d.getHours().toString().padStart(2, '0')
  const mins = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month} ${hours}:${mins}`
}

function getMedal(position: number): string {
  switch (position) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return `${position}º`
  }
}

export function StatisticsPanel({ isOpen, onClose }: StatisticsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('records')
  const [expandedTable, setExpandedTable] = useState<number | null>(null)
  const planets = useGameStore((state) => state.planets)
  const totalStars = useGameStore((state) => state.totalStars)
  const { getTopRecordsByPoints, getAllTopRecordsByPoints, getTablesWithRecords } = useRecordsStore()

  const maxStars = planets.length * 5
  const completedPlanets = planets.filter((p) => p.status === 'completed').length
  const progressPercent = Math.round((completedPlanets / planets.length) * 100)

  const tablesWithRecords = getTablesWithRecords()

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

  const renderRecords = () => {
    if (tablesWithRecords.length === 0) {
      return (
        <div className="text-center text-white/50 py-8">
          <p className="text-4xl mb-2">🏆</p>
          <p>¡Aún no hay récords!</p>
          <p className="text-sm">Completa tablas para aparecer aquí</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {[2, 3, 4, 5, 6, 7, 8, 9].map((table) => {
          const isExpanded = expandedTable === table
          const records = isExpanded
            ? getAllTopRecordsByPoints(table, 10)
            : getTopRecordsByPoints(table, 10)
          if (records.length === 0 && !isExpanded) {
            // Check if there are any records at all for collapsed view
            const allRecords = getTopRecordsByPoints(table, 1)
            if (allRecords.length === 0) return null
          }

          return (
            <div key={table} className="bg-space-dark rounded-xl p-3">
              {/* Table header - clickable */}
              <button
                className="flex items-center gap-2 mb-2 w-full text-left"
                onClick={() => setExpandedTable(isExpanded ? null : table)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${PLANET_COLORS[table - 1]}`}>
                  {table}
                </div>
                <span className="text-white font-medium text-sm flex-1">Tabla del {table}</span>
                <span className="text-white/40 text-xs">
                  {isExpanded ? '▲ Mejores tiempos' : '▼ Ver detalle'}
                </span>
              </button>

              {/* Column headers */}
              <div className="flex items-center gap-1 text-[10px] text-white/40 mb-1 pl-7 pr-1">
                <span className="w-5 text-center shrink-0">#</span>
                <span className="flex-1">Jugador</span>
                <span className="w-[100px] text-right">Tiempo+Penal=Total</span>
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
                      <span className="w-[100px] text-right text-white/50 font-mono text-[10px]">
                        {timeSeconds}s{penaltySeconds > 0 ? `+${penaltySeconds}s` : ''}={record.points}s
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

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'records', label: 'Récords', icon: '🏆' },
    { id: 'progress', label: 'Mi Progreso', icon: '📈' },
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
                  {activeTab === 'records' && (
                    <motion.div
                      key="records"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <p className="text-white/60 text-sm mb-3 text-center">
                        Mejor por jugador · Toca una tabla para ver todos los tiempos
                      </p>
                      {renderRecords()}
                    </motion.div>
                  )}

                  {activeTab === 'progress' && (
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
