import { describe, it, expect } from 'vitest'
import { calculateStars } from './starCalculator'

describe('calculateStars', () => {
  it('returns 0 stars for accuracy below 70%', () => {
    expect(calculateStars(0)).toBe(0)
    expect(calculateStars(50)).toBe(0)
    expect(calculateStars(69)).toBe(0)
  })

  it('returns 1 star (Bronze) for accuracy 70-84%', () => {
    expect(calculateStars(70)).toBe(1)
    expect(calculateStars(75)).toBe(1)
    expect(calculateStars(84)).toBe(1)
  })

  it('returns 2 stars (Silver) for accuracy 85-94%', () => {
    expect(calculateStars(85)).toBe(2)
    expect(calculateStars(90)).toBe(2)
    expect(calculateStars(94)).toBe(2)
  })

  it('returns 3 stars (Gold) for accuracy 95% and above', () => {
    expect(calculateStars(95)).toBe(3)
    expect(calculateStars(100)).toBe(3)
  })

  it('handles edge cases at threshold boundaries', () => {
    expect(calculateStars(69.9)).toBe(0)
    expect(calculateStars(84.9)).toBe(1)
    expect(calculateStars(94.9)).toBe(2)
  })
})
