import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { LearnableBase, LearnableWithId } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import { updateActiveBank } from '../mutators/mutator-utils'

export const withTranslateFeature = <_>() =>
  signalStoreFeature(
    { state: type<LearnablesStoreType>() },
    withMethods((store) => ({
      addTranslationHistoryItem(learnable: LearnableBase) {
        updateActiveBank(store, (b) => {
          const maxItems = 20
          const newItem: LearnableWithId = {
            ...learnable,
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
      },
      deleteTranslationHistoryItems(ids: string[]) {
        updateActiveBank(store, (b) => {
          const newHistory = b.translations.history.filter((item) => !ids.includes(item.id))
          return {
            ...b,
            translations: {
              ...b.translations,
              history: newHistory
            }
          }
        })
      },
      deleteMagicTranslateItems(ids: string[]) {
        updateActiveBank(store, (b) => {
          const newCards = b.translations.magicTranslateCards.filter(
            (item) => !ids.includes(item.id)
          )
          return {
            ...b,
            translations: {
              ...b.translations,
              magicTranslateCards: newCards
            }
          }
        })
      },
      setMagicTranslateCards(cards: LearnableBase[]) {
        updateActiveBank(store, (b) => {
          const cardsWithIds = cards.map((c) => ({
            ...c,
            id: crypto.randomUUID(),
            createdAt: new Date()
          }))

          return {
            ...b,
            translations: {
              ...b.translations,
              magicTranslateCards: cardsWithIds
            }
          }
        })
      },
      updateTranslateTone(tone: string) {
        updateActiveBank(store, (b) => ({
          ...b,
          translations: {
            ...b.translations,
            tone: tone
          }
        }))
      }
    }))
  )
