import { createContext, useContext, ReactNode } from 'react'
import { useSound } from '@/hooks/useSound'

type SoundType = 'correct' | 'incorrect' | 'click' | 'unlock' | 'celebration'

interface SoundContextType {
  playSound: (type: SoundType) => void
  setEnabled: (enabled: boolean) => void
}

const SoundContext = createContext<SoundContextType | null>(null)

interface SoundProviderProps {
  children: ReactNode
}

export function SoundProvider({ children }: SoundProviderProps) {
  const sound = useSound()

  return (
    <SoundContext.Provider value={sound}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundContext() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider')
  }
  return context
}
