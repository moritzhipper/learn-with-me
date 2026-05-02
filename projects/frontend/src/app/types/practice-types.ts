import { Practice } from '@shared/types'

type PracticeType = Practice['type']

export type PracticeConfigBase<T extends PracticeType> = {
  type: T
  direction: 'forward' | 'reverse'
  learnableIds: string[]
}

export type PracticeConfigCustom = PracticeConfigBase<'custom'>

export type PracticeConfigCollection = PracticeConfigBase<'collection'> & {
  collectionId: string
}

export type PracticeConfigAddedByDay = PracticeConfigBase<'added-on-day'> & {
  dateAddedUTC: number
}

export type PracticeConfig =
  | PracticeConfigCustom
  | PracticeConfigCollection
  | PracticeConfigAddedByDay
