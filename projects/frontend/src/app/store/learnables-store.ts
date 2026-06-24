import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { computed } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { BankShareBase, BankUser } from '@shared/types'
import { withBankCrud } from './features/bank-crud'
import { withCardsCrud } from './features/cards-crud'
import { withCollectionsCrud } from './features/collections-crud'
import { withPracticeFeature } from './features/practice-feature'
import { withTranslateFeature } from './features/translation-feature'
import { initialState } from './initial-states'

export const LearnablesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withStorageSync({
    key: 'language_helper_learnables',
    storage: () => localStorage
  }),
  withComputed((state) => ({
    activeBank: computed(() => {
      return state.banks().find((b) => b.id === state.activeBankId())!
    }),
    collections: computed(() => {
      return state.banks().find((b) => b.id === state.activeBankId())?.collections || []
    }),
    learnables: computed(() => {
      return state.banks().find((b) => b.id === state.activeBankId())?.learnables || []
    })
  })),
  withCardsCrud(),
  withCollectionsCrud(),
  withPracticeFeature(),
  withTranslateFeature(),
  withBankCrud(),
  withMethods((state) => ({
    mergeIntoActiveBank(bankShareBase: BankShareBase) {
      const cards = bankShareBase.learnables
      const collections = bankShareBase.collections
      const { idsOfDuplicates } = state.importCards(cards)
      // add collections
      // replace duplicate card ids with existing ids, so the collection stays intact but links the existing cards

      for (const collection of collections) {
        const id = state.createCollection(collection.name)
        const addIDs = collection.cardIds.map((cardId) => {
          const duplicate = idsOfDuplicates.find((d) => d.importedID === cardId)
          return duplicate?.duplicateID ?? cardId
        })

        state.updateCollection({ id, addIDs })
      }
    },
    reset() {
      patchState(state, initialState)
    },
    addBankForDebug(bank: BankUser) {
      patchState(state, (state) => ({
        ...state,
        banks: [...state.banks, bank],
        activeBankId: bank.id
      }))
    }
  }))
)
