import type { BankUser, LanguageConfig } from '@shared/types'

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

export type LearnableCreationConfig = {
  input: string
  type: 'phrases' | 'words' | 'both'
  language: LanguageConfig
}

export type Guess = 'right' | 'wrong' | 'unanswered'

export type Guessable = {
  id: string
  guessed: Guess
}

export type SettingsStoreType = {
  apiKey: string
  tokensUsed: number
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
  fileExportName: string
  fileExportSuffix: string
  happyExpressions: string[]
  sadExpressions: string[]
}

export type BankShareResponse = {
  id: string
  expires: Date
}
