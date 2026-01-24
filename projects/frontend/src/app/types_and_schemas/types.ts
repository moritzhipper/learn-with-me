import type {
  BankRequestConfig,
  BankUser,
  LanguageConfig,
  LanguageConfigRequest
} from '@shared/types'

export type LearnablesStoreType = {
  banks: BankUser[]
  activeBankId: string | null
  currentPractice: Practice | null
}

export type Practice = {
  index: number
  guessables: Guessable[]
  reverseDirection: boolean
}

type LearnableCreationConfigBase = {
  language: LanguageConfig
  type: 'phrase' | 'word' | 'both'
}

export type LearnableFromTextCreationConfig = LearnableCreationConfigBase & {
  source: 'text'
  text: string
}

export type LearnableFromImageCreationConfig = LearnableCreationConfigBase & {
  source: 'image'
  image: string
}

export type LearnableCreationConfig =
  | LearnableFromTextCreationConfig
  | LearnableFromImageCreationConfig

export type Guess = 'right' | 'wrong' | 'unanswered'

export type Guessable = {
  id: string
  guessed: Guess
}

export type SettingsStoreType = {
  apiKey: string
  tokensUsed: number
  userID: string
}

type Optional<T> = { [K in keyof T]?: T[K] | null }

export type LearnablesFilterConfig = Optional<{
  order: 'asc' | 'desc'
  orderBy: 'created' | 'lexeme' | 'confidence' | 'random'
  type: 'word' | 'phrase'
  ids: string[]
  age: number | 'newest'
  confidence: 'medium' | 'low'
  search: string
}>

export type AppConfig = {
  appNameLong: string
  appNameShort: string
  fileExportName: string
  fileExportSuffix: string
  bankIDParamName: string
}

export type BankShareResponse = {
  id: string
  expires: Date
}

export type ExplorePageCategoryConfig = LanguageConfigRequest & BankRequestConfig

export type ApiFetchState = 'loading' | 'idle' | 'error' | 'all-loaded' | 'no-data'
