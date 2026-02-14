import { motion } from 'framer-motion'
import { useSoundContext } from '@/contexts/SoundContext'

interface NumericKeyboardProps {
  onNumberPress: (num: number) => void
  onDelete: () => void
  onSubmit: () => void
}

export function NumericKeyboard({ onNumberPress, onDelete, onSubmit }: NumericKeyboardProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const { playSound } = useSoundContext()

  const handleNumberPress = (num: number) => {
    playSound('click')
    onNumberPress(num)
  }

  const handleDelete = () => {
    playSound('click')
    onDelete()
  }

  const handleSubmit = () => {
    playSound('click')
    onSubmit()
  }

  return (
    <div className="grid grid-cols-3 gap-3 mx-auto px-2" style={{ width: 'fit-content' }}>
      {/* Numbers 1-9 */}
      {numbers.map((num) => (
        <motion.button
          key={num}
          onClick={() => handleNumberPress(num)}
          className="w-16 h-16 rounded-full bg-gradient-to-b from-space-navy to-space-navy/80 text-white text-3xl font-bold
                     border border-white/10 shadow-lg shadow-black/30
                     active:scale-95 transition-all"
          whileTap={{ scale: 0.88 }}
        >
          {num}
        </motion.button>
      ))}

      {/* Delete button */}
      <motion.button
        onClick={handleDelete}
        className="w-16 h-16 rounded-full bg-gradient-to-b from-red-900/60 to-red-950/60 text-white text-3xl
                   border border-red-500/20 shadow-lg shadow-black/30
                   active:scale-95 transition-all"
        whileTap={{ scale: 0.88 }}
      >
        ←
      </motion.button>

      {/* Zero */}
      <motion.button
        onClick={() => handleNumberPress(0)}
        className="w-16 h-16 rounded-full bg-gradient-to-b from-space-navy to-space-navy/80 text-white text-3xl font-bold
                   border border-white/10 shadow-lg shadow-black/30
                   active:scale-95 transition-all"
        whileTap={{ scale: 0.88 }}
      >
        0
      </motion.button>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        className="w-16 h-16 rounded-full bg-gradient-to-b from-emerald-600 to-emerald-700 text-white text-3xl
                   border border-emerald-400/30 shadow-lg shadow-emerald-900/30
                   active:scale-95 transition-all"
        whileTap={{ scale: 0.88 }}
      >
        ✓
      </motion.button>
    </div>
  )
}
