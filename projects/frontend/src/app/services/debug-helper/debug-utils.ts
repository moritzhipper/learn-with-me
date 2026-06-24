import {
  BankUser,
  Collection,
  Guess,
  Guessable,
  PracticeActive,
  UserLearnable
} from '@shared/types'

type SeedDebugBankConfig = {
  name: string
  learning: string
  speaking: string
  collectionConfig: {
    name: string
    cardCount: number
    practicedDaysAgo: number[]
  }[]
  customPracticeDaysAgo: number[]
}

const defaultDebugConfig: SeedDebugBankConfig = {
  name: 'Debug Bank',
  learning: 'Dutch',
  speaking: 'German',
  collectionConfig: [
    {
      name: 'Collection 1',
      cardCount: 10,
      practicedDaysAgo: [7, 7, 5, 5, 2, 1, 0]
    },
    {
      name: 'Collection 2',
      cardCount: 20,
      practicedDaysAgo: [2, 5, 10, 16]
    }
  ],
  customPracticeDaysAgo: [2, 5, 20]
}

const daysAgoToDate = (now: Date, daysAgo: number): Date => {
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  return date
}

const buildLearnable = (index: number, now: Date): UserLearnable => ({
  id: crypto.randomUUID(),
  lexeme: `Lexeme ${index}`,
  translation: `Translation ${index}`,
  type: 'word',
  notes: '',
  createdAt: now,
  guesses: {
    lexeme: [false, false, false, false, false],
    translation: [false, false, false, false, false]
  }
})

const guessPool: Guess[] = ['right', 'wrong', 'unanswered']

const toGuessables = (ids: string[], offset = 0): Guessable[] =>
  ids.map((id, index) => ({
    id,
    guess: guessPool[(index + offset) % guessPool.length]
  }))

const buildCollectionPractices = (
  collection: Collection,
  daysAgoList: number[],
  now: Date
): PracticeActive[] =>
  daysAgoList.map((daysAgo, practiceIndex) => ({
    type: 'collection',
    collectionId: collection.id,
    createdAt: daysAgoToDate(now, daysAgo),
    guessableIndex: collection.cardIds.length,
    guessables: toGuessables(collection.cardIds, practiceIndex),
    learnableIDs: collection.cardIds,
    direction: 'guessTranslation'
  }))

const buildCustomPractices = (
  learnableIds: string[],
  daysAgoList: number[],
  now: Date
): PracticeActive[] => {
  return daysAgoList.map((daysAgo, practiceIndex) => ({
    type: 'custom',
    createdAt: daysAgoToDate(now, daysAgo),
    guessableIndex: learnableIds.length,
    guessables: toGuessables(learnableIds, practiceIndex + 1),
    learnableIDs: learnableIds,
    direction: 'guessTranslation'
  }))
}

export const buildDebugBank = (): BankUser => {
  const config = defaultDebugConfig
  const now = new Date()

  let counter = 1
  const { collections, allLearnables } = config.collectionConfig.reduce(
    (acc, colConfig) => {
      const learnables = Array.from({ length: colConfig.cardCount }, () =>
        buildLearnable(counter++, now)
      )
      const collection: Collection = {
        id: crypto.randomUUID(),
        name: colConfig.name,
        cardIds: learnables.map((l) => l.id),
        createdAt: now
      }
      acc.allLearnables.push(...learnables)
      acc.collections.push(collection)
      return acc
    },
    { collections: [] as Collection[], allLearnables: [] as UserLearnable[] }
  )

  const collectionPractices = collections.flatMap((collection, i) =>
    buildCollectionPractices(collection, config.collectionConfig[i].practicedDaysAgo, now)
  )
  const customPractices = buildCustomPractices(
    allLearnables.map((l) => l.id),
    config.customPracticeDaysAgo,
    now
  )

  return {
    id: crypto.randomUUID(),
    name: config.name,
    createdAt: now,
    language: { speaking: config.speaking, learning: config.learning },
    translations: { magicTranslateCards: [], history: [], tone: 'neutral' },
    learnables: allLearnables,
    collections,
    practice: {
      active: null,
      history: [...collectionPractices, ...customPractices]
    }
  }
}
