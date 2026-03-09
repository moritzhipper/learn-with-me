import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { computed } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import {
  BankBase,
  BankShareBase,
  LearnableBase,
  TranslationHistoryItem,
  UserLearnablePartial
} from '@shared/types'
import { Guess } from '../types_and_schemas/types'
import { initialState } from './initialStates'
import {
  applyBankUpdates,
  BankMergeSummary,
  createBank,
  deleteBank,
  removeLearnables,
  saveImportToNewBank as saveImportAsNewBank,
  saveImportToActiveBankNew,
  setActiveBank,
  updateBank
} from './mutators/bank-mutators'
import { saveNewlyCreatedLearnables, updateLearnables } from './mutators/card-mutators'
import {
  createCollection,
  deleteCollection,
  editCollection,
  renameCollection
} from './mutators/collection-mutators'
import {
  quitPracticeEarly,
  removePractice,
  setGuess,
  startPractice
} from './mutators/practice-mutators'
import {
  addTranslationHistoryItem,
  deleteTranslationHistoryItem,
  setTone
} from './mutators/translation-mutators'

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
  withMethods((state) => {
    return {
      addLearnables(learnablesBase: LearnableBase[]) {
        patchState(state, saveNewlyCreatedLearnables(learnablesBase))
      },
      updateLearnables(learnables: UserLearnablePartial[]) {
        patchState(state, updateLearnables(learnables))
      },
      removeLearnables(ids: string[]) {
        patchState(state, removeLearnables(ids))
      },
      startPractice(ids: string[], reverseDirection: boolean) {
        patchState(state, startPractice(ids, reverseDirection))
      },
      addTranslationHistoryItem(learnable: Omit<TranslationHistoryItem, 'id'>) {
        patchState(state, addTranslationHistoryItem(learnable))
      },
      deleteTranslationHistoryItem(id: string) {
        patchState(state, deleteTranslationHistoryItem(id))
      },
      updateTranslateTone(tone: string) {
        patchState(state, setTone(tone))
      },
      createCollection(name: string, ids: string[]) {
        patchState(state, createCollection(name, ids))
      },
      editCollectionLearnables(collectionID: string, addIDs: string[], deleteIDs: string[]) {
        patchState(state, editCollection(collectionID, addIDs, deleteIDs))
      },
      mergeBankIntoActiveBank(importBank: BankShareBase): BankMergeSummary {
        const result = saveImportToActiveBankNew(state.activeBank(), importBank)
        patchState(state, applyBankUpdates(result.updatedBank))
        return result.summary
      },
      saveBankAsNewBank(importBank: BankShareBase) {
        patchState(state, saveImportAsNewBank(importBank))
      },
      editCollection(name: string, id: string) {
        patchState(state, renameCollection(name, id))
      },
      deleteCollection(id: string, removeLearnables: boolean = false) {
        patchState(state, deleteCollection(id, removeLearnables))
      },
      addBank(base: BankBase) {
        patchState(state, createBank(base))
      },
      updateBank(base: BankBase, bankID: string) {
        patchState(state, updateBank(base, bankID))
      },
      setActiveBank(id: string) {
        patchState(state, setActiveBank(id))
      },
      deleteBank(id: string) {
        patchState(state, deleteBank(id))
      },
      quitPracticePrematurly() {
        patchState(state, quitPracticeEarly())
      },
      quitPractice() {
        patchState(state, removePractice())
      },
      setGuess(guess: Guess) {
        patchState(state, setGuess(guess))
      },
      reset() {
        patchState(state, initialState)
      }
    }
  })
)
