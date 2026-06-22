import { BankBase, BankShareBase, BankUser, LearnableBase, UserLearnable } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import {
  learnablesLexemeMatch as lLexemeMatch,
  learnablesMatch as lMatch,
  learnablesTranslationMatch as lTranslationMatch,
  mapBaseToUserLearnable
} from './mutator-utils'

export const createBank =
  (base: BankBase) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const newBank: BankUser = {
      id: crypto.randomUUID(),
      name: base.name,
      createdAt: new Date(),
      translations: {
        history: [],
        tone: '',
        magicTranslateCards: []
      },
      language: base.language,
      collections: [],
      learnables: [],
      practice: {
        active: null,
        history: []
      }
    }

    return {
      ...state,
      activeBankId: newBank.id,
      banks: [...state.banks, newBank]
    }
  }

export const updateBank =
  (base: BankBase, bankID: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    banks: state.banks.map((b) => (b.id === bankID ? { ...b, ...base } : b))
  })

export const deleteBank =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // do not allow deleting the only bank
    if (state.banks.length === 1) {
      console.warn('Cannot delete bank if its the only one.')
      return state
    }

    // remove the bank
    const banks = state.banks.filter((b) => b.id !== id)

    // set id of active bank to existing bank if the active bank is deleted
    const activeBankId = state.activeBankId !== id ? state.activeBankId : banks[0].id

    return {
      ...state,
      banks,
      activeBankId
    }
  }

export const setActiveBank =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    activeBankId: id
  })

export const saveImportToNewBank =
  (bank: BankShareBase) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const now = new Date()
    const newBank: BankUser = {
      ...bank,
      id: crypto.randomUUID(),
      language: bank.language,
      createdAt: now,
      translations: {
        history: [],
        tone: '',
        magicTranslateCards: []
      },
      learnables: bank.learnables.map((l) => mapBaseToUserLearnable(l)),
      collections: bank.collections.map((c) => ({
        ...c,
        createdAt: now
      })),
      practice: {
        active: null,
        history: []
      }
    }
    return {
      ...state,
      banks: [newBank, ...state.banks]
    }
  }

type ImportMatch =
  | { type: 'duplicate'; existingId: string }
  | { type: 'lexeme-match'; existing: UserLearnable }
  | { type: 'translation-match'; existing: UserLearnable }
  | { type: 'new' }

export type BankMergeSummary = {
  newCount: number
  mergedCount: number
}

const findImportMatch = (
  imported: LearnableBase,
  existingLearnables: UserLearnable[]
): ImportMatch => {
  const duplicate = existingLearnables.find((e) => lMatch(e, imported))
  if (duplicate) return { type: 'duplicate', existingId: duplicate.id }

  const lexemeMatch = existingLearnables.find((e) => lLexemeMatch(e, imported))
  if (lexemeMatch) return { type: 'lexeme-match', existing: lexemeMatch }

  const translationMatch = existingLearnables.find((e) => lTranslationMatch(e, imported))
  if (translationMatch) return { type: 'translation-match', existing: translationMatch }

  return { type: 'new' }
}

/**
 * Merges import into active Bank
 *
 * Process:
 * 1. Compare every imported learnable against existing ones to find duplicates or cards with same lexeme/translation
 *    - When card is duplicate or mergeable, save id to matchingCardIds
 *    - When card is mergeable, save merged learnable to mergedLearnables
 *    - When card is new, create new learnable and save to mergedLearnables and matchingCardIds
 * 2. Apply merge
 *    - Merged learnable ids do not have to be added to existing collections (they are already in there)
 *    - Card IDs in new Collections will be remapped using matchingCardIds
 * 3. For lexeme/translation matches, merge the differing field and map imported ID to existing ID
 *
 * Results:
 *    - for duplicates and merges, the mergeCounter is incremented, as those cards are merged with existing items
 *    - for new cards, the newCounter is incremented
 *
 * @returns Updated Bank and summary of the merge
 */
export const saveImportToActiveBankNew = (
  activeBank: BankUser,
  newBank: BankShareBase
): {
  updatedBank: BankUser
  summary: BankMergeSummary
} => {
  const now = new Date()
  const matchingCardIds = new Map<string, string>()
  const mergedLearnables = new Map<string, UserLearnable>()

  let newCount = 0
  let mergedCount = 0

  // Initialize with existing learnables
  for (const existing of activeBank.learnables) {
    mergedLearnables.set(existing.id, existing)
  }

  // Process each imported learnable
  for (const imported of newBank.learnables) {
    const match = findImportMatch(imported, activeBank.learnables)

    if (match.type === 'duplicate') {
      mergedCount = mergedCount + 1
      matchingCardIds.set(imported.id, match.existingId)
    } else if (match.type === 'lexeme-match') {
      mergedCount = mergedCount + 1
      matchingCardIds.set(imported.id, match.existing.id)
      mergedLearnables.set(match.existing.id, {
        ...match.existing,
        lexeme: `${match.existing.lexeme} / ${imported.lexeme}`
      })
    } else if (match.type === 'translation-match') {
      mergedCount = mergedCount + 1
      matchingCardIds.set(imported.id, match.existing.id)
      mergedLearnables.set(match.existing.id, {
        ...match.existing,
        translation: `${match.existing.translation} / ${imported.translation}`
      })
    } else if (match.type === 'new') {
      newCount = newCount + 1
      const newId = crypto.randomUUID()
      matchingCardIds.set(imported.id, newId)
      mergedLearnables.set(newId, mapBaseToUserLearnable(imported, newId, now))
    }
  }

  // Process collections: remap IDs and create new collections
  const newCollections = newBank.collections.map((importedCollection) => ({
    id: crypto.randomUUID(),
    name: importedCollection.name,
    cardIds: importedCollection.cardIds
      .map((id) => matchingCardIds.get(id))
      .filter((id) => id !== undefined),
    createdAt: now
  }))

  return {
    updatedBank: {
      ...activeBank,
      learnables: [...mergedLearnables.values()],
      collections: [...activeBank.collections, ...newCollections]
    },
    summary: {
      newCount,
      mergedCount
    }
  }
}

export const applyBankUpdates =
  (newBank: BankUser) =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    banks: state.banks.map((b) => (b.id === newBank.id ? newBank : b))
  })
