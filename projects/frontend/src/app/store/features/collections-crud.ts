import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { LearnablesStoreType } from '../../types/types'
import { updateActiveBank } from '../mutators/mutator-utils'

export type CollectionUpdater = {
  id: string
  deleteIDs?: string[]
  addIDs?: string[]
  name?: string
}

export const withCollectionsCrud = <_>() =>
  signalStoreFeature(
    { state: type<LearnablesStoreType>() },
    withMethods((store) => ({
      createCollection(name: string) {
        updateActiveBank(store, (b) => ({
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
      },
      updateCollection(update: CollectionUpdater) {
        updateActiveBank(store, (b) => ({
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
      },
      deleteCollection(id: string) {
        updateActiveBank(store, (b) => ({
          ...b,
          collections: b.collections.filter((c) => c.id !== id)
        }))
      }
    }))
  )
