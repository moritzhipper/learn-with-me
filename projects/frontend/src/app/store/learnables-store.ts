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
import {
  applyBankUpdates,
  BankMergeSummary,
  saveImportToNewBank as saveImportAsNewBank,
  saveImportToActiveBankNew
} from './mutators/bank-mutators'

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
  withMethods((state) => {
    return {
      mergeBankIntoActiveBank(importBank: BankShareBase): BankMergeSummary {
        const result = saveImportToActiveBankNew(state.activeBank(), importBank)
        patchState(state, applyBankUpdates(result.updatedBank))
        return result.summary
      },
      saveBankAsNewBank(importBank: BankShareBase) {
        patchState(state, saveImportAsNewBank(importBank))
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
    }
  })
)
