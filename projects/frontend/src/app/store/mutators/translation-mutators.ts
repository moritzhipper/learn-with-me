import { LearnableBase, TranslationHistoryItem } from '@shared/types'
import { LearnablesStoreType } from '../../types_and_schemas/types'
import { updateActiveBank } from './mutator-utils'

export const addTranslationHistoryItem =
  (base: Omit<TranslationHistoryItem, 'id' | 'createdAt'>) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const maxItems = 20
      const newItem = {
        ...base,
        id: crypto.randomUUID(),
        createdAt: new Date()
      }
      const newHistory = [newItem, ...(b.translations.history || [])].slice(0, maxItems)
      return {
        ...b,
        translations: {
          ...b.translations,
          history: newHistory
        }
      }
    })

export const addMagicTranslateCards =
  (cards: LearnableBase[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const cardsWithIds = cards.map((c) => ({ ...c, id: crypto.randomUUID() }))

      return {
        ...b,
        translations: {
          ...b.translations,
          magicTranslateCards: cardsWithIds
        }
      }
    })

export const deleteTranslationHistoryItem =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const newHistory = b.translations.history.filter((item) => item.id !== id)
      return {
        ...b,
        translations: {
          ...b.translations,
          history: newHistory
        }
      }
    })

export const setTone =
  (tone: string) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => ({
      ...b,
      translations: {
        ...b.translations,
        tone: tone
      }
    }))
