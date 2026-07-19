import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import type { LearnablesStoreType } from '../../types/store-types'
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
      createCollection(name: string): string {
        const newId = crypto.randomUUID()

        updateActiveBank(store, (b) => {
          const collectionNames = b.collections.map((c) => c.name)
          const makeNameUnique = (name: string): string =>
            collectionNames.includes(name) ? `${name} (new)` : name

          return {
            ...b,
            collections: [
              ...b.collections,
              {
                id: newId,
                createdAt: new Date(),
                name: makeNameUnique(name),
                cardIds: []
              }
            ]
          }
        })
        return newId
      },
      updateCollection(update: CollectionUpdater) {
        updateActiveBank(store, (b) => {
          return {
            ...b,
            collections: b.collections.map((c) => {
              if (c.id !== update.id) return c
              const withAdded = c.cardIds.concat(update.addIDs ?? [])

              const deletetIDs = update.deleteIDs ?? []
              const withoutDeleted = withAdded.filter((id) => !deletetIDs.includes(id))

              const newCardIdsSet = new Set(withoutDeleted)

              return {
                ...c,
                name: update.name ?? c.name,
                cardIds: Array.from(newCardIdsSet)
              }
            })
          }
        })
      },
      deleteCollection(id: string) {
        updateActiveBank(store, (b) => ({
          ...b,
          collections: b.collections.filter((c) => c.id !== id)
        }))
      }
    }))
  )
