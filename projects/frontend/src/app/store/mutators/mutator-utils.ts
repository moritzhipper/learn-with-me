import { patchState, WritableStateSource } from '@ngrx/signals'
import { BankUser, LearnableBase } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'

/** Helper to update the active bank in state */
export const updateActiveBank = (
  state: WritableStateSource<LearnablesStoreType>,
  updater: (bank: BankUser) => BankUser
): void =>
  patchState(state, (currentState) => ({
    ...currentState,
    banks: currentState.banks.map((bank) => {
      if (bank.id !== currentState.activeBankId) return bank
      return updater(bank)
    })
  }))

export const learnablesMatch = (l1: LearnableBase, l2: LearnableBase) =>
  l1.lexeme === l2.lexeme && l1.translation === l2.translation && l1.type === l2.type

export const learnablesTranslationMatch = (l1: LearnableBase, l2: LearnableBase) =>
  l1.translation === l2.translation && l1.lexeme !== l2.lexeme

export const learnablesLexemeMatch = (l1: LearnableBase, l2: LearnableBase) =>
  l1.lexeme === l2.lexeme && l1.translation !== l2.translation
