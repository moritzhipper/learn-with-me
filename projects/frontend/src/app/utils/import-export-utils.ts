import { BankShareBaseSchema } from '@shared/schemas'
import {
  BankShareBase,
  BankUser,
  LearnableBase,
  LearnableWithId,
  UserLearnable
} from '@shared/types'
import { config } from '../../config'

// #region Export Functions

export type BankExportOptions = {
  onlyForCollectionIds?: string[]
  includeUserData?: boolean
}

/**
 * Maps the learnables and collections to a format suitable to put into a file for export.
 *
 * Maps name of aisgns bank the collection name if only one collection is selected
 */
export const mapBankToExportable = (
  bank: BankUser,
  options?: BankExportOptions
): BankShareBase | BankUser => {
  // Filter collections to export
  const collectionsToExport = bank.collections.filter((c) => {
    const collIDs = options?.onlyForCollectionIds
    if (!collIDs || collIDs.length === 0) return true
    return collIDs.includes(c.id)
  })

  // Get all card IDs that belong to the collections being exported

  // Assign bank the collection name if only one collection is being exported
  const bankName = collectionsToExport.length === 1 ? collectionsToExport[0].name : bank.name

  // Filter learnables: if exporting specific collections, only include cards in those collections
  const exportedCards = bank.learnables.filter((l) =>
    collectionsToExport.some((c) => c.cardIds.includes(l.id))
  )
  // return full bank including history and stuff
  if (options?.includeUserData) {
    return {
      ...bank,
      name: bankName,
      learnables: exportedCards,
      collections: collectionsToExport
    }
  }

  // return 'anonymized' bank only holding cards and banks and nothing more

  const learnablesWithoutGuesses: LearnableWithId[] = exportedCards.map((l) => ({
    lexeme: l.lexeme,
    translation: l.translation,
    type: l.type,
    id: l.id,
    notes: l.notes,
    createdAt: l.createdAt
  }))

  return {
    name: bankName,
    language: bank.language,
    learnables: learnablesWithoutGuesses,
    collections: collectionsToExport
  }
}

// #region Import Functions

export const parseBankImportString = (fileAsString: string): BankShareBase | BankUser => {
  const userBank = BankShareBaseSchema.safeParse(JSON.parse(fileAsString))
  const baseBank = BankShareBaseSchema.safeParse(JSON.parse(fileAsString))

  if (userBank.success) return userBank.data
  if (baseBank.success) return baseBank.data
  throw new Error('Invalid file format')
}

export const verifiyImportedFileValidity = (file: File): void => {
  const fileSuffixIsCorrect = file.name.split('.').pop()?.toLowerCase() === config.fileExportSuffix

  if (!fileSuffixIsCorrect) {
    throw new Error('Wrong file extension.')
  }
}

type BankRemapOptions = {
  invertLanguages: boolean
}

export const remapImportedBankLanguages = <T = BankShareBase | BankUser>(
  bank: T,
  options: BankRemapOptions
): T => {
  throw new Error('Not implemented yet')
}

export const filterDoubleEntries = (
  newLearnables: LearnableBase[],
  existingLearnables: UserLearnable[]
): LearnableBase[] => {
  const setOfLexemes = new Set<string>()

  // remove double entries from ai generated learnables
  const uniqueNewLearnables = newLearnables.filter((l) => {
    const isUnique = !setOfLexemes.has(l.lexeme)
    setOfLexemes.add(l.lexeme)
    return isUnique
  })

  // filter out learnables that already exist in the store
  const filteredNewLearnables = newLearnables.filter(
    (newL) =>
      !existingLearnables.some(
        (existingL) =>
          existingL.lexeme === newL.lexeme && existingL.translation === newL.translation
      )
  )

  return filteredNewLearnables
}
