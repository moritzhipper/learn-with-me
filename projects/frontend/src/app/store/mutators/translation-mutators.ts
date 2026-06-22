import { LearnableBase, LearnableWithId } from '@shared/types'
import { updateActiveBank } from './mutator-utils'

export const addTranslationHistoryItem = (base: LearnableBase) =>
  updateActiveBank((b) => {
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

export const addMagicTranslateCards = (cards: LearnableBase[]) =>
  updateActiveBank((b) => {
    const cardsWithIds = cards.map((c) => ({ ...c, id: crypto.randomUUID() }))

    return {
      ...b,
      translations: {
        ...b.translations,
        magicTranslateCards: cardsWithIds
      }
    }
  })

export const deleteTranslationHistoryItem = (ids: string[]) =>
  updateActiveBank((b) => {
    const newHistory = b.translations.history.filter((item) => !ids.includes(item.id))
    return {
      ...b,
      translations: {
        ...b.translations,
        history: newHistory
      }
    }
  })

export const deleteMagicTranslateCards = (ids: string[]) =>
  updateActiveBank((b) => {
    const newCards = b.translations.magicTranslateCards.filter((item) => !ids.includes(item.id))
    return {
      ...b,
      translations: {
        ...b.translations,
        magicTranslateCards: newCards
      }
    }
  })

export const setTone = (tone: string) =>
  updateActiveBank((b) => ({
    ...b,
    translations: {
      ...b.translations,
      tone: tone
    }
  }))
