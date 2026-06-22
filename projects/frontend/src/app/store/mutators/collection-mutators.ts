import { updateActiveBank } from './mutator-utils'

type CollectionUpdater = {
  id: string
  deleteIDs?: string[]
  addIDs?: string[]
  name?: string
}

export const createCollection = (name: string) =>
  updateActiveBank((b) => ({
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

export const updateCollection = (update: CollectionUpdater) =>
  updateActiveBank((b) => ({
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

export const deleteCollection = (id: string) =>
  updateActiveBank((b) => ({
    ...b,
    collections: b.collections.filter((c) => c.id !== id)
  }))
