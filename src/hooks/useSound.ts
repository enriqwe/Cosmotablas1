import { useCallback, useRef, useEffect } from 'react'

type SoundType = 'correct' | 'incorrect' | 'click' | 'unlock' | 'celebration'

// Sound frequencies and durations for synthesized sounds
const SOUND_CONFIGS: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType }> = {
  correct: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 - happy chord
    durations: [0.1, 0.1, 0.2],
    type: 'sine',
  },
  incorrect: {
    frequencies: [200, 150], // Low descending tones
    durations: [0.15, 0.2],
    type: 'square',
  },
  click: {
    frequencies: [800],
    durations: [0.05],
    type: 'sine',
  },
  unlock: {
    frequencies: [392, 523.25, 659.25, 783.99], // G4, C5, E5, G5 - ascending
    durations: [0.1, 0.1, 0.1, 0.3],
    type: 'sine',
  },
  celebration: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6
    durations: [0.15, 0.15, 0.15, 0.4],
    type: 'sine',
  },
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const enabledRef = useRef(true)

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
    }

    // Listen for first interaction
    const events = ['touchstart', 'mousedown', 'keydown']
    events.forEach((event) => {
      document.addEventListener(event, initAudio, { once: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, initAudio)
      })
    }
  }, [])

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return

    // Initialize on demand if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const config = SOUND_CONFIGS[type]
    let startTime = ctx.currentTime

    config.frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = config.type
      oscillator.frequency.setValueAtTime(freq, startTime)

      // Envelope for smoother sound
      const duration = config.durations[index]
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)

      startTime += duration * 0.7 // Slight overlap for smoother transitions
    })
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled
  }, [])

  return { playSound, setEnabled }
}
