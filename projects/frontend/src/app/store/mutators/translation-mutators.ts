import { LearnableFromAI } from '@shared/types'
import { LearnablesStoreType } from '../../types_and_schemas/types'
import { updateActiveBank } from './mutator-utils'

export const addTranslationHistoryItem =
  (base: LearnableFromAI) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const maxItems = 20
      const newHistory = [base, ...(b.translationHistory || [])].slice(0, maxItems)
      return {
        ...b,
        translationHistory: newHistory
      }
    })
