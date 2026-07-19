import { BankUser, GuessHistory } from '@shared/types'
import { LearnablesStoreType, SettingsStoreType } from '../types/store-types'

export const initialState: LearnablesStoreType = {
  banks: [],
  activeBankId: null
}

export const initialSettings: SettingsStoreType = {
  apiKey: '',
  tokensUsed: 0,
  userID: crypto.randomUUID()
}

export const initialTranslations: BankUser['translations'] = {
  history: [],
  magicTranslateCards: [],
  tone: ''
}

export const initialPractice: BankUser['practice'] = {
  active: null,
  history: []
}

export const initialGuesses: {
  lexeme: GuessHistory
  translation: GuessHistory
} = {
  lexeme: [false, false, false, false, false],
  translation: [false, false, false, false, false]
}
