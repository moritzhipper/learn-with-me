import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { computed } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import {
  BankBase,
  BankShareBase,
  BankUser,
  Guess,
  LearnableBase,
  PracticeConfig,
  UserLearnablePartial
} from '@shared/types'
import { initialState } from './initialStates'
import {
  applyBankUpdates,
  BankMergeSummary,
  createBank,
  deleteBank,
  saveImportToNewBank as saveImportAsNewBank,
  saveImportToActiveBankNew,
  setActiveBank,
  updateBank
} from './mutators/bank-mutators'
import { createCards, deleteCards, updateCards } from './mutators/card-mutators'
import {
  CollectionUpdater,
  createCollection,
  deleteCollection,
  updateCollection
} from './mutators/collection-mutators'
import {
  createPractice,
  endPracticeEarly,
  savePracticeToHistoryAndReset
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
      createCards(learnablesBase: LearnableBase[]): string[] {
        const ids = createCards(state, learnablesBase)
        return ids
      },
      updateCards(learnables: UserLearnablePartial[]) {
        updateCards(state, learnables)
      },
      deleteCards(ids: string[]) {
        deleteCards(state, ids)
      },
      createCollection(name: string, ids: string[]) {
        createCollection(state, name)
      },
      updateCollection(updater: CollectionUpdater) {
        updateCollection(state, updater)
      },
      deleteCollection(id: string) {
        deleteCollection(state, id)
      },
      startPractice(config: PracticeConfig) {
        // ensure that quit practices are saved to history

        if (!!state.activeBank().practice.active) endPracticeEarly(state)

        createPractice(state, config)
      },
      addTranslationHistoryItem(learnable: LearnableBase) {
        addTranslationHistoryItem(state, learnable)
      },
      deleteTranslationHistoryItems(ids: string[]) {
        deleteTranslationHistoryItem(state, ids)
      },
      deleteMagicTranslateItems(ids: string[]) {
        deleteMagicTranslateCards(state, ids)
      },
      setMagicTranslateCards(cards: LearnableBase[]) {
        addMagicTranslateCards(state, cards)
      },
      updateTranslateTone(tone: string) {
        setTone(state, tone)
      },

      editCollectionLearnables(updater: CollectionUpdater) {
        updateCollection(state, updater)
      },

      mergeBankIntoActiveBank(importBank: BankShareBase): BankMergeSummary {
        const result = saveImportToActiveBankNew(state.activeBank(), importBank)
        patchState(state, applyBankUpdates(result.updatedBank))
        return result.summary
      },
      saveBankAsNewBank(importBank: BankShareBase) {
        patchState(state, saveImportAsNewBank(importBank))
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
        endPracticeEarly(state)
      },
      quitPractice() {
        savePracticeToHistoryAndReset(state)
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
