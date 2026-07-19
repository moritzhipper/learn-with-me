import { Signal } from '@angular/core'
import { BankUser, LearnableBase, LearnableBaseWithID, UserLearnable } from '@shared/types'
import { ImportCardsResult } from '../store/features/cards-crud'
import { CollectionUpdater } from '../store/features/collections-crud'

export type SettingsStoreType = {
  apiKey: string
  tokensUsed: number
  userID: string
}

export type LearnablesStoreType = {
  banks: BankUser[]
  activeBankId: string | null
}

/**
 * Holds types for functions that are shared throughout store features
 */
export type LearnablesStoreTypeSharedMethods = {
  importCards(cards: (LearnableBase | LearnableBaseWithID | UserLearnable)[]): ImportCardsResult
  createCollection(name: string): string
  updateCollection(update: CollectionUpdater): void
}

export type LearnablesStoreTypeComputed = {
  activeBank: Signal<BankUser>
}
