import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { BankBase, BankUser } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'

export const withBankCrud = <_>() =>
  signalStoreFeature(
    { state: type<LearnablesStoreType>() },
    withMethods((store) => ({
      createBank(base: BankBase) {
        const newBank: BankUser = {
          ...base,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          translations: {
            history: [],
            tone: '',
            magicTranslateCards: []
          },
          collections: [],
          learnables: [],
          practice: {
            active: null,
            history: []
          }
        }
        patchState(store, {
          ...store,
          activeBankId: newBank.id,
          banks: [newBank, ...store.banks()]
        })
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
