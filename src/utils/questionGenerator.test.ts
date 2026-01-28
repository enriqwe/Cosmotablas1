import { describe, it, expect } from 'vitest'
import { generateQuestions } from './questionGenerator'

describe('generateQuestions', () => {
  it('generates the requested number of questions (max 8)', () => {
    const questions = generateQuestions(5, 8)
    expect(questions).toHaveLength(8)
  })

  it('caps at 8 questions even if more requested', () => {
    const questions = generateQuestions(5, 20)
    expect(questions).toHaveLength(8)
  })

  it('generates questions for the specified multiplication table', () => {
    const questions = generateQuestions(7, 8)
    questions.forEach((q) => {
      expect(q.table).toBe(7)
    })
  })

  it('calculates correct answers for each question', () => {
    const questions = generateQuestions(6, 8)
    questions.forEach((q) => {
      expect(q.correctAnswer).toBe(q.table * q.multiplier)
    })
  })

  it('generates unique question IDs', () => {
    const questions = generateQuestions(4, 8)
    const ids = questions.map((q) => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(8)
  })

  it('uses multipliers between 2 and 9 only', () => {
    const questions = generateQuestions(3, 8)
    questions.forEach((q) => {
      expect(q.multiplier).toBeGreaterThanOrEqual(2)
      expect(q.multiplier).toBeLessThanOrEqual(9)
    })
  })

  it('generates 8 unique multipliers (2-9)', () => {
    const questions = generateQuestions(2, 8)
    const multipliers = questions.map((q) => q.multiplier)
    const uniqueMultipliers = new Set(multipliers)
    expect(uniqueMultipliers.size).toBe(8)
    // Verify all multipliers are 2-9
    expect(Math.min(...multipliers)).toBe(2)
    expect(Math.max(...multipliers)).toBe(9)
  })

  it('defaults to 8 questions when count is not specified', () => {
    const questions = generateQuestions(5)
    expect(questions).toHaveLength(8)
  })
})
