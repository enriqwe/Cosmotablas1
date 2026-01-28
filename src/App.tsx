import { motion } from 'framer-motion'
import { APP_NAME, APP_VERSION } from '@/constants/config'

function App() {
  return (
    <div className="min-h-screen bg-space-dark text-white font-sans flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gold mb-4">{APP_NAME}</h1>
        <p className="text-white/40 text-xs">v{APP_VERSION}</p>
        <p className="text-space-blue text-xl mb-2">Vite + React + TypeScript + Tailwind</p>
        <p className="text-success">Foundation Ready</p>
        <div className="mt-6 space-x-2">
          <span className="inline-block px-3 py-1 bg-space-navy rounded">space-navy</span>
          <span className="inline-block px-3 py-1 bg-space-blue rounded">space-blue</span>
          <span className="inline-block px-3 py-1 bg-warning text-space-dark rounded">warning</span>
        </div>
      </motion.div>
    </div>
  )
}

export default App
