import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { BankBase, BankShareBase, BankUser, UserLearnable } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import { initialGuesses, initialPractice, initialTranslations } from '../initial-states'

export const withBankCrud = <_>() =>
  signalStoreFeature(
    { state: type<LearnablesStoreType>() },
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
      importBank(bank: BankUser | BankShareBase): string {
        const newID = crypto.randomUUID()

        const isUserBank = 'practice' in bank

        if (isUserBank) {
          patchState(store, {
            banks: [{ ...bank, id: newID }, ...store.banks()]
          })
        } else {
          const userLearnables: UserLearnable[] = bank.learnables.map((l) => ({
            ...l,
            guesses: initialGuesses
          }))

          const newBank: BankUser = {
            ...bank,
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
      updateBank(base: BankBase, bankID: string) {
        const updatedBanks = store.banks().map((b) => (b.id === bankID ? { ...b, ...base } : b))
        patchState(store, {
          banks: updatedBanks
        })
      },
      deleteBank(id: string) {
        const banks = store.banks()
        if (banks.length === 1) {
          console.warn('Cannot delete bank if its the only one.')
          return
        }

        // remove the bank
        const updatedBanks = banks.filter((b) => b.id !== id)

        // set id of active bank to existing bank if the active bank is deleted
        const currentActiveBankID = store.activeBankId()
        const activeBankID = currentActiveBankID !== id ? currentActiveBankID : banks[0].id

        patchState(store, {
          banks: updatedBanks,
          activeBankId: activeBankID
        })
      },
      setActiveBank(id: string) {
        patchState(store, {
          activeBankId: id
        })
      }
    }))
  )
