import { WritableStateSource } from '@ngrx/signals'
import { LearnableBase, LearnableWithId } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import { updateActiveBank } from './mutator-utils'

export const addTranslationHistoryItem = (
  state: WritableStateSource<LearnablesStoreType>,
  base: LearnableBase
) =>
  updateActiveBank(state, (b) => {
    const maxItems = 20
    const newItem: LearnableWithId = {
      ...base,
      id: crypto.randomUUID()
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

export const addMagicTranslateCards = (
  state: WritableStateSource<LearnablesStoreType>,
  cards: LearnableBase[]
) =>
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

export const deleteTranslationHistoryItem = (
  state: WritableStateSource<LearnablesStoreType>,
  ids: string[]
) =>
  updateActiveBank(state, (b) => {
    const newHistory = b.translations.history.filter((item) => !ids.includes(item.id))
    return {
      ...b,
      translations: {
        ...b.translations,
        history: newHistory
      }
    }
  })

export const deleteMagicTranslateCards = (
  state: WritableStateSource<LearnablesStoreType>,
  ids: string[]
) =>
  updateActiveBank(state, (b) => {
    const newCards = b.translations.magicTranslateCards.filter((item) => !ids.includes(item.id))
    return {
      ...b,
      translations: {
        ...b.translations,
        magicTranslateCards: newCards
      }
    }
  })

export const setTone = (state: WritableStateSource<LearnablesStoreType>, tone: string) =>
  updateActiveBank(state, (b) => ({
    ...b,
    translations: {
      ...b.translations,
      tone: tone
    }
  }))
