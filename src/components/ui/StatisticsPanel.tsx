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

type TabType = 'progress' | 'errors' | 'time' | 'points'

function formatTime(ms: number): string {
  const seconds = Math.round(ms / 1000)
  return `${seconds}s`
}

function getMedal(position: number): string {
  switch (position) {
    case 0: return '🥇'
    case 1: return '🥈'
    case 2: return '🥉'
    default: return `${position + 1}º`
  }
}

export function StatisticsPanel({ isOpen, onClose }: StatisticsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('progress')
  const planets = useGameStore((state) => state.planets)
  const totalStars = useGameStore((state) => state.totalStars)
  const { getTopRecordsByErrors, getTopRecordsByTime, getTopRecordsByPoints, getTablesWithRecords } = useRecordsStore()

  const maxStars = planets.length * 3
  const completedPlanets = planets.filter((p) => p.status === 'completed').length
  const progressPercent = Math.round((completedPlanets / planets.length) * 100)

  const tablesWithRecords = getTablesWithRecords()

  const renderStars = (count: number) => {
    return (
      <span className="text-sm">
        {[1, 2, 3].map((i) => (
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

  const renderLeaderboard = (
    getRecords: (table: number) => TableRecord[],
    getValue: (record: TableRecord) => string
  ) => {
    if (tablesWithRecords.length === 0) {
      return (
        <div className="text-center text-white/50 py-8">
          <p className="text-4xl mb-2">📊</p>
          <p>¡Aún no hay récords!</p>
          <p className="text-sm">Completa tablas para aparecer aquí</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {[2, 3, 4, 5, 6, 7, 8, 9].map((table) => {
          const records = getRecords(table)
          if (records.length === 0) return null

          return (
            <div key={table} className="bg-space-dark rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${PLANET_COLORS[table - 1]}`}>
                  {table}
                </div>
                <span className="text-white font-medium">Tabla del {table}</span>
              </div>
              <div className="space-y-1 pl-2">
                {records.map((record, index) => (
                  <div
                    key={`${record.userId}-${index}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-6">{getMedal(index)}</span>
                    <span className="flex-1 text-white/80 truncate">{record.userName}</span>
                    <span className="text-white/60 font-mono">{getValue(record)}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'progress', label: 'Mi Progreso', icon: '📈' },
    { id: 'errors', label: 'Menos Errores', icon: '✅' },
    { id: 'time', label: 'Más Rápido', icon: '⚡' },
    { id: 'points', label: 'Puntuación', icon: '🏆' },
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
              <div className="flex border-b border-white/10 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 min-w-[80px] px-2 py-3 text-xs font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'text-gold border-b-2 border-gold bg-space-dark/30'
                        : 'text-white/60 hover:text-white/80'}
                    `}
                  >
                    <span className="block text-base mb-0.5">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
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

                  {activeTab === 'errors' && (
                    <motion.div
                      key="errors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <p className="text-white/60 text-sm mb-3 text-center">
                        Menos errores por tabla
                      </p>
                      {renderLeaderboard(
                        getTopRecordsByErrors,
                        (r) => `${r.errors} ${r.errors === 1 ? 'error' : 'errores'}`
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'time' && (
                    <motion.div
                      key="time"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <p className="text-white/60 text-sm mb-3 text-center">
                        Tiempo más rápido por tabla
                      </p>
                      {renderLeaderboard(
                        getTopRecordsByTime,
                        (r) => formatTime(r.timeMs)
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'points' && (
                    <motion.div
                      key="points"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <p className="text-white/60 text-sm mb-3 text-center">
                        Puntuación (tiempo + 5s por error)
                      </p>
                      {renderLeaderboard(
                        getTopRecordsByPoints,
                        (r) => `${r.points} pts`
                      )}
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
