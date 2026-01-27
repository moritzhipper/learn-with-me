import { GuessHistory } from '@shared/types'
import { LearnablesStoreType, SettingsStoreType } from '../types_and_schemas/types'

export const initialState: LearnablesStoreType = {
  banks: [],
  activeBankId: null,
  currentPractice: null
}

export const initialSettings: SettingsStoreType = {
  apiKey: '',
  tokensUsed: 0,
  userID: crypto.randomUUID()
}

export const initialGuesses: {
  lexeme: GuessHistory
  translation: GuessHistory
} = {
  lexeme: [false, false, false, false, false],
  translation: [false, false, false, false, false]
}
