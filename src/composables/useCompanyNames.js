import { getRandomInt } from '../services/util.service.js'

const FIXED_AMOUNT = 4

export function useCompanyNames(base = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      const names = []

      for (let i = 0; i < FIXED_AMOUNT; i++) {
        const firstWord = firstWords[getRandomInt(0, firstWords.length - 1)]
        const secondWord = secondWords[getRandomInt(0, secondWords.length - 1)]
        const name = `${base}${firstWord}${secondWord}`
        names.push(name)
      }

      resolve(names)
    }, 2000)
  })
}

const firstWords = [
  'Neo',
  'Hyper',
  'Smart',
  'Bright',
  'Next',
  'Quantum',
  'Nova',
  'Astra',
  'Blue',
  'Green',
  'Omni',
  'Cloud',
  'Deep',
  'Cyber',
  'Alpha',
  'Meta',
  'Pixel',
  'Flow',
  'Future',
  'Ultra',
]

const secondWords = [
  'Tech',
  'Solutions',
  'Labs',
  'Systems',
  'Dynamics',
  'Works',
  'AI',
  'Digital',
  'Network',
  'Edge',
  'Logic',
  'Ware',
  'Studio',
  'Analytics',
  'Global',
  'Vision',
  'Group',
  'Corp',
  'Inc',
  'Soft',
]
