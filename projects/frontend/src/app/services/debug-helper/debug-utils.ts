import { BankUser, CollectionUser, Guessable, Practice, UserLearnable } from '@shared/types'

type SeedDebugBankConfig = {
  name: string
  collectionConfig: {
    name: string
    cardCount: number
  }[]
  practiceConfig: {
    type: Practice['type']
    daysAgo: number
  }[]
}

const defaultDebugConfig: SeedDebugBankConfig = {
  name: 'Debug Bank',
  collectionConfig: [
    {
      name: 'Collection 1',
      cardCount: 10
    },
    {
      name: 'Collection 2',
      cardCount: 20
    }
  ],
  practiceConfig: [
    {
      type: 'collection',
      daysAgo: 1
    },
    {
      type: 'collection',
      daysAgo: 2
    },
    {
      type: 'collection',
      daysAgo: 10
    }
  ]
}

export const buildDebugBank = (): BankUser => {
  const config = defaultDebugConfig
  const bankId = crypto.randomUUID()
  const now = new Date()

  let counter = 1
  const allLearnables: UserLearnable[] = []

  const collections: CollectionUser[] = config.collectionConfig.map((colConfig) => {
    const cardIds: string[] = []
    for (let i = 0; i < colConfig.cardCount; i++) {
      const id = crypto.randomUUID()
      cardIds.push(id)
      allLearnables.push({
        id,
        lexeme: `Lexeme ${counter}`,
        translation: `Translation ${counter}`,
        type: 'word',
        notes: '',
        createdAt: now,
        guesses: {
          lexeme: [false, false, false, false, false],
          translation: [false, false, false, false, false]
        }
      })
      counter++
    }
    return {
      id: crypto.randomUUID(),
      name: colConfig.name,
      cardIds,
      createdAt: now
    }
  })

  const practiceHistory: Practice[] = config.practiceConfig.map((practiceConf, index) => {
    const practiceDate = new Date(now)
    practiceDate.setDate(practiceDate.getDate() - practiceConf.daysAgo)

    const collection = collections[index % collections.length]
    const guessables: Guessable[] = collection.cardIds.map((id) => ({
      id,
      guess: 'unanswered'
    }))

    if (practiceConf.type === 'collection') {
      return {
        type: 'collection',
        collectionId: collection.id,
        createdAt: practiceDate,
        guessableIndex: guessables.length,
        guessables,
        direction: 'forward'
      }
    } else {
      return {
        type: 'custom',
        createdAt: practiceDate,
        guessableIndex: guessables.length,
        guessables,
        direction: 'forward'
      }
    }
  })

  return {
    id: bankId,
    name: config.name,
    createdAt: now,
    language: { speaking: 'English', learning: 'Spanish' },
    translations: {
      magicTranslateCards: [],
      history: [],
      tone: 'neutral'
    },
    learnables: allLearnables,
    collections,
    practice: {
      current: null,
      history: practiceHistory
    }
  }
}
