import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { BankBase, BankShareBase, BankUser, LanguageConfig, UserLearnable } from '@shared/types'
import type { LearnablesStoreType, LearnablesStoreTypeSharedMethods } from '../../types/store-types'
import { initialGuesses, initialPractice, initialTranslations } from '../initial-states'
import { ImportCardsResult } from './cards-crud'

const isUserBank = (bank: BankUser | BankShareBase): bank is BankUser =>
  'createdAt' in bank && 'translations' in bank && 'practice' in bank

export const withBankCrud = <_>() =>
  signalStoreFeature(
    {
      state: type<LearnablesStoreType>(),
      methods: type<LearnablesStoreTypeSharedMethods>()
    },
    withMethods((store) => ({
      createBank(base: BankBase): string {
        const newBank: BankUser = {
          ...base,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          collections: [],
          learnables: [],
          translations: initialTranslations,
          practice: initialPractice
        }

        patchState(store, {
          banks: [newBank, ...store.banks()]
        })

        return newBank.id
      },
      importBankAsNew(bank: BankUser | BankShareBase, invertDirection: boolean = false): string {
        const bankWithCorrectDirection = invertDirection ? invertLanguageDirection(bank) : bank

        const newID = crypto.randomUUID()
        if (isUserBank(bankWithCorrectDirection)) {
          patchState(store, {
            banks: [{ ...bankWithCorrectDirection, id: newID }, ...store.banks()]
          })
        } else {
          const userLearnables: UserLearnable[] = bankWithCorrectDirection.learnables.map((l) => ({
            ...l,
            guesses: initialGuesses
          }))

          const newBank: BankUser = {
            ...bankWithCorrectDirection,
            id: newID,
            createdAt: new Date(),
            learnables: userLearnables,
            translations: initialTranslations,
            practice: initialPractice
          }

          patchState(store, {
            banks: [newBank, ...store.banks()]
          })
        }

        return newID
      },
      mergeBankIntoActive(
        bank: BankUser | BankShareBase,
        invertDirection: boolean = false
      ): ImportCardsResult {
        const bankWithCorrectDirection = invertDirection ? invertLanguageDirection(bank) : bank

        const result = store.importCards(bankWithCorrectDirection.learnables)

        for (const collection of bankWithCorrectDirection.collections) {
          const id = store.createCollection(collection.name)

          const cardIDs = collection.cardIds.map((id) => {
            const duplicate = result.idsOfDuplicates.find((d) => d.importedID === id)
            if (duplicate) return duplicate.existingDuplicateID
            return id
          })

          store.updateCollection({
            id,
            addIDs: cardIDs
          })
        }

        return result
      },
      updateBank(base: BankBase, bankID: string) {
        const updatedBanks = store.banks().map((b) => (b.id === bankID ? { ...b, ...base } : b))
        patchState(store, {
          banks: updatedBanks
        })
      },
      deleteBank(id: string) {
        const banks = store.banks()
        if (banks.length === 1) throw new Error('You can not delete the bank if its the only one.')
        if (id === store.activeBankId()) throw new Error('Cannot delete active bank.')

        patchState(store, {
          banks: banks.filter((b) => b.id !== id)
        })
      },
      setActiveBank(id: string) {
        patchState(store, {
          activeBankId: id
        })
      }
    }))
  )

const invertLanguageDirection = <T extends BankUser | BankShareBase>(bank: T): T => {
  const invertCards = (cards: T['learnables']): T['learnables'] =>
    cards.map((l) => ({
      ...l,
      lexeme: l.translation,
      translation: l.lexeme
    }))

  const language: LanguageConfig = {
    speaking: bank.language.speaking,
    learning: bank.language.learning
  }

  const learnables = invertCards(bank.learnables)

  if (!isUserBank(bank)) {
    return {
      ...bank,
      language,
      learnables
    }
  }

  return {
    ...bank,
    language,
    learnables,
    translations: {
      ...bank.translations,
      magicTranslateCards: invertCards(bank.translations.magicTranslateCards),
      history: invertCards(bank.translations.history)
    }
  }
}
