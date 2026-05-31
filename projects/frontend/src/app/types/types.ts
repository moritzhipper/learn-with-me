import { BankRequestConfig, BankUser, LanguageConfig, LanguageConfigRequest } from '@shared/types'

export type LearnablesStoreType = {
  banks: BankUser[]
  activeBankId: string | null
}

export type TranslateFastConfig = {
  text: string
  tone: string
  language: LanguageConfig
}

export type LearnableCreationConfigBase = {
  language: LanguageConfig
  cardType: 'phrase' | 'word' | 'both'
}

export type LearnableFromTextCreationConfig = LearnableCreationConfigBase & {
  sourceType: 'text' | 'prompt'
  source: string
}

export type LearnableFromImageCreationConfig = LearnableCreationConfigBase & {
  sourceType: 'image'
  source: string
}

export type LearnableCreationConfig =
  | LearnableFromTextCreationConfig
  | LearnableFromImageCreationConfig

export type SettingsStoreType = {
  apiKey: string
  tokensUsed: number
  userID: string
}

export type ImportStrategy = 'merge' | 'new'

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
