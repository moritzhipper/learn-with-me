import { TranslationHistoryItem } from '@shared/types'
import { LearnablesStoreType } from '../../types_and_schemas/types'
import { updateActiveBank } from './mutator-utils'

export const addTranslationHistoryItem =
  (base: Omit<TranslationHistoryItem, 'id'>) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const maxItems = 20
      const newItem = {
        ...base,
        id: crypto.randomUUID()
      }
      const newHistory = [newItem, ...(b.translationHistory || [])].slice(0, maxItems)
      return {
        ...b,
        translationHistory: newHistory
      }
    })

export const deleteTranslationHistoryItem =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const newHistory = b.translationHistory.filter((item) => item.id !== id)
      return {
        ...b,
        translationHistory: newHistory
      }
    })

export const setTone =
  (tone: string) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => ({
      ...b,
      translateTone: tone
    }))
