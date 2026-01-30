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
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto p-4">
      {/* Numbers 1-9 */}
      {numbers.map((num) => (
        <motion.button
          key={num}
          onClick={() => handleNumberPress(num)}
          className="w-14 h-14 bg-space-navy text-white text-2xl font-bold rounded-xl
                     hover:bg-space-blue active:scale-95 transition-all"
          whileTap={{ scale: 0.9 }}
        >
          {num}
        </motion.button>
      ))}

      {/* Delete button */}
      <motion.button
        onClick={handleDelete}
        className="w-14 h-14 bg-space-navy text-white text-2xl rounded-xl
                   hover:bg-warning/80 active:scale-95 transition-all"
        whileTap={{ scale: 0.9 }}
      >
        ←
      </motion.button>

      {/* Zero */}
      <motion.button
        onClick={() => handleNumberPress(0)}
        className="w-14 h-14 bg-space-navy text-white text-2xl font-bold rounded-xl
                   hover:bg-space-blue active:scale-95 transition-all"
        whileTap={{ scale: 0.9 }}
      >
        0
      </motion.button>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        className="w-14 h-14 bg-success text-white text-2xl rounded-xl
                   hover:bg-success/80 active:scale-95 transition-all"
        whileTap={{ scale: 0.9 }}
      >
        ✓
      </motion.button>
    </div>
  )
}
