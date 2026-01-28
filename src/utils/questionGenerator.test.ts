import { describe, it, expect } from 'vitest'
import { generateQuestions } from './questionGenerator'

describe('generateQuestions', () => {
  it('generates the requested number of questions', () => {
    const questions = generateQuestions(5, 20)
    expect(questions).toHaveLength(20)
  })

  it('generates questions for the specified multiplication table', () => {
    const questions = generateQuestions(7, 10)
    questions.forEach((q) => {
      expect(q.table).toBe(7)
    })
  })

  it('calculates correct answers for each question', () => {
    const questions = generateQuestions(6, 10)
    questions.forEach((q) => {
      expect(q.correctAnswer).toBe(q.table * q.multiplier)
    })
  })

  it('generates unique question IDs', () => {
    const questions = generateQuestions(4, 20)
    const ids = questions.map((q) => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(20)
  })

  it('uses multipliers between 1 and 10', () => {
    const questions = generateQuestions(3, 10)
    questions.forEach((q) => {
      expect(q.multiplier).toBeGreaterThanOrEqual(1)
      expect(q.multiplier).toBeLessThanOrEqual(10)
    })
  })

  it('generates 10 unique multipliers when asking for 10 questions', () => {
    const questions = generateQuestions(2, 10)
    const multipliers = questions.map((q) => q.multiplier)
    const uniqueMultipliers = new Set(multipliers)
    expect(uniqueMultipliers.size).toBe(10)
  })

  it('handles requests for more than 10 questions with repeated multipliers', () => {
    const questions = generateQuestions(8, 20)
    expect(questions).toHaveLength(20)
    questions.forEach((q) => {
      expect(q.correctAnswer).toBe(8 * q.multiplier)
    })
  })

  it('defaults to 20 questions when count is not specified', () => {
    const questions = generateQuestions(5)
    expect(questions).toHaveLength(20)
  })
})
