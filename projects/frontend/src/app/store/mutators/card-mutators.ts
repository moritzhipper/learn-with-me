import { LearnableBase, UserLearnablePartial } from '@shared/types'
import { mapBaseToFullToLearnables, updateActiveBank } from './mutator-utils'

// todo: add rotate ids option for import
// Report ids of added (always, safety for when regenerated ids) -> when skipped because duplicate, report the old card thing
export const createLearnables = (learnablesBase: LearnableBase[]) =>
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

export const updateLearnables = (updatedL: UserLearnablePartial[]) =>
  updateActiveBank((b) => ({
    ...b,
    learnables: b.learnables.map((l) => {
      const updated = updatedL.find((ul) => ul.id === l.id)
      if (!updated) return l
      return { ...l, ...updated }
    })
  }))

export const deleteLearnables = (ids: string[]) =>
  updateActiveBank((b) => {
    const updatedLearnables = b.learnables.filter((l) => !ids.includes(l.id))
    const updatedCollections = b.collections.map((c) => ({
      ...c,
      cardIds: c.cardIds.filter((cardId) => !ids.includes(cardId))
    }))

    const practiceHoldsDeleted = !!b.practice.active?.guessables.some((g) => ids.includes(g.id))
    return {
      ...b,
      learnables: updatedLearnables,
      collections: updatedCollections,
      practice: practiceHoldsDeleted ? { ...b.practice, active: null } : b.practice
    }
  })
