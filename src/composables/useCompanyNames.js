import { getRandomInt } from '../services/util.service.js'

const FIXED_AMOUNT = 4
const symbols = [' ', '-', '']

// @CR: Does this really need to be a composeable?
export function useCompanyNames(base = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      const names = []

      for (let i = 0; i < FIXED_AMOUNT; i++) {
        const nameWordCount = getRandomInt(2, 3) // Randomly choose 1 or 2 words

        const firstWord = firstWords[getRandomInt(0, firstWords.length - 1)]
        const secondWord = secondWords[getRandomInt(0, secondWords.length - 1)]
        const symbol = symbols[getRandomInt(0, symbols.length - 1)]

        const words = [base, firstWord, secondWord]

        let name = ''
        for (let i = 0; i < nameWordCount; i++) {
          const randonIdx = getRandomInt(0, words.length - 1)
          name += i + 1 === nameWordCount ? `${words[randonIdx]}` : `${words[randonIdx]}${symbol}`
          words.splice(randonIdx, 1)
        }

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
