import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
}

interface ParticleSystemProps {
  isActive: boolean
  duration?: number
  intensity?: 'normal' | 'record'
}

const COLORS = ['#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6']
const RECORD_COLORS = ['#fbbf24', '#f59e0b', '#fde68a', '#fcd34d', '#fffbeb', '#fbbf24', '#ef4444', '#8b5cf6']

export function ParticleSystem({ isActive, duration = 3000, intensity = 'normal' }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const isRecord = intensity === 'record'
    const particleCount = isRecord ? 200 : 60
    const colors = isRecord ? RECORD_COLORS : COLORS
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      // For record mode, spawn from multiple points across the screen
      const spawnX = isRecord
        ? canvas.width * (0.1 + Math.random() * 0.8)
        : canvas.width / 2
      const spawnY = isRecord
        ? canvas.height * (0.2 + Math.random() * 0.4)
        : canvas.height / 2

      particlesRef.current.push({
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * (isRecord ? 16 : 10),
        vy: (Math.random() - 0.5) * (isRecord ? 16 : 10) - (isRecord ? 5 : 3),
        size: Math.random() * (isRecord ? 12 : 8) + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * (isRecord ? 90 : 60) + 60,
      })
    }

    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Update
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.15 // Gravity
        particle.life++

        // Draw star shape
        const alpha = Math.max(0, 1 - particle.life / particle.maxLife)
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = particle.color
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.life * 0.1))

        // Draw a 5-point star
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
          const radius = i % 2 === 0 ? particle.size : particle.size / 2
          if (i === 0) {
            ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
          } else {
            ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
          }
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isActive, duration])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
