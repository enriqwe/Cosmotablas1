import { motion } from 'framer-motion'
import { SolarMap } from '@/features/solar-map/SolarMap'
import { StarCounter } from '@/components/layout/StarCounter'
import { APP_NAME } from '@/constants/config'

function App() {
  return (
    <div className="min-h-screen bg-space-dark text-white font-sans flex flex-col">
      {/* Header */}
      <motion.header
        className="p-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gold">{APP_NAME}</h1>
        <p className="text-white/60 text-sm">Explora el Sistema Solar</p>
      </motion.header>

      {/* Star Counter */}
      <StarCounter />

      {/* Main Content - Solar Map */}
      <SolarMap />
    </div>
  )
}

export default App
