import { WritableStateSource } from '@ngrx/signals'
import { LearnablesStoreType } from '../../types/types'
import { updateActiveBank } from './mutator-utils'

type CollectionUpdater = {
  id: string
  deleteIDs?: string[]
  addIDs?: string[]
  name?: string
}

export const createCollection = (state: WritableStateSource<LearnablesStoreType>, name: string) =>
  updateActiveBank(state, (b) => ({
    ...b,
    collections: [
      ...b.collections,
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        name,
        cardIds: []
      }
    ]
  }))

export const updateCollection = (
  state: WritableStateSource<LearnablesStoreType>,
  update: CollectionUpdater
) =>
  updateActiveBank(state, (b) => ({
    ...b,
    collections: b.collections.map((c) => {
      if (c.id !== update.id) return c
      return {
        ...c,
        name: update.name ?? c.name,
        cardIds: [...new Set([...(update.addIDs ?? []), ...c.cardIds])].filter(
          (id) => !(update.deleteIDs ?? []).includes(id)
        )
      }
    })
  }))

export const deleteCollection = (state: WritableStateSource<LearnablesStoreType>, id: string) =>
  updateActiveBank(state, (b) => ({
    ...b,
    collections: b.collections.filter((c) => c.id !== id)
  }))
