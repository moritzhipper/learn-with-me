import { LearnableBase, LearnableWithId, UserLearnablePartial } from '@shared/types'
import { updateCollectionCardIDs } from './collection-mutators'
import { mapBaseToFullToLearnables, updateActiveBank } from './mutator-utils'

export const saveLearnables = (learnablesBase: LearnableBase[]) =>
  updateActiveBank((b) => {
    // Filter out duplicates in input and items that already exist in bank
    const newLearnables = learnablesBase.filter(
      (lb, index, self) =>
        self.findIndex(
          (other) => other.lexeme === lb.lexeme && other.translation === lb.translation
        ) === index &&
        !b.learnables.some((l) => lb.lexeme === l.lexeme && lb.translation === l.translation)
    )

    const fullNew = mapBaseToFullToLearnables(newLearnables)

    return {
      ...b,
      learnables: [...b.learnables, ...fullNew]
    }
  })

export const importFromTranslate = (learnablesBase: LearnableWithId[], collectionID?: string) =>
  updateActiveBank((b) => {
    const learnableIds = learnablesBase.map((l) => l.id)
    const fullNew = mapBaseToFullToLearnables(learnablesBase)

    return {
      ...b,
      collections: b.collections.map(updateCollectionCardIDs(collectionID, learnableIds)),
      learnables: [...fullNew, ...b.learnables]
    }
  })

export const updateLearnables = (updatedL: UserLearnablePartial[]) =>
  updateActiveBank((b) => ({
    ...b,
    learnables: b.learnables.map((l) => {
      const updated = updatedL.find((ul) => ul.id === l.id)
      if (!updated) return l
      return { ...l, ...updated }
    })
  }))
