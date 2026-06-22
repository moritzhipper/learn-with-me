import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { computed } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import {
  BankBase,
  BankShareBase,
  BankUser,
  Guess,
  LearnableBase,
  LearnableWithId,
  PracticeConfig,
  UserLearnablePartial
} from '@shared/types'
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
import { createLearnables, importFromTranslate, updateCards } from './mutators/card-mutators'
import {
  createCollection,
  deleteCollection,
  editCollection,
  renameCollection
} from './mutators/collection-mutators'
import {
  createPractice,
  endPracticeEarly,
  savePracticeToHistoryAndReset,
  setGuess
} from './mutators/practice-mutators'
import {
  addMagicTranslateCards,
  addTranslationHistoryItem,
  deleteMagicTranslateCards,
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
        const ids = createLearnables(state, learnablesBase)
        return ids
      },
      updateLearnables(learnables: UserLearnablePartial[]) {
        patchState(state, updateCards(learnables))
      },
      removeLearnables(ids: string[]) {
        patchState(state, removeLearnables(ids))
      },
      startPractice(config: PracticeConfig) {
        // ensure that quit practices are saved to history
        if (!!state.activeBank().practice.active) patchState(state, endPracticeEarly())

        patchState(state, createPractice(config))
      },
      addTranslationHistoryItem(learnable: LearnableBase) {
        patchState(state, addTranslationHistoryItem(learnable))
      },
      deleteTranslationHistoryItems(ids: string[]) {
        patchState(state, deleteTranslationHistoryItem(ids))
      },
      deleteMagicTranslateItems(ids: string[]) {
        patchState(state, deleteMagicTranslateCards(ids))
      },
      setMagicTranslateCards(cards: LearnableBase[]) {
        patchState(state, addMagicTranslateCards(cards))
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
      importLearnablesFromTranslate(learnables: LearnableWithId[], collectionID?: string) {
        patchState(state, importFromTranslate(learnables, collectionID))
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
        patchState(state, endPracticeEarly())
      },
      quitPractice() {
        patchState(state, savePracticeToHistoryAndReset())
      },
      setGuess(guess: Guess) {
        patchState(state, setGuess(guess))
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
