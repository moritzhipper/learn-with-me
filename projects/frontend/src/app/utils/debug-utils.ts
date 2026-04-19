import { Practice } from '@shared/types'
import { LearnablesStoreType } from '../types_and_schemas/types'

type DebugStoreConfig = {
  collectionConfig: {
    name: string
    cardCount: number
  }[]
  practiceConfig: {
    type: Practice['type']
    daysAgo: number
  }[]
}

const defaultDebugConfig: DebugStoreConfig = {
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
    }
  ]
}

export const buildDebugStore = (): LearnablesStoreType => {}
