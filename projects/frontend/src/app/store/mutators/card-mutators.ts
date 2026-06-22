import { WritableStateSource } from '@ngrx/signals'
import { Guess, LearnableBase } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import {
  mapBaseToFullToLearnables,
  updateActiveBank,
  updateActiveBankWithResult
} from './mutator-utils'

type CardUpdater = {
  id: string
  addGuessTranslation?: Guess
  addGuessLexeme?: Guess
} & Partial<Pick<LearnableBase, 'lexeme' | 'translation' | 'type' | 'notes'>>

// todo: add rotate ids option for import
// Report ids of added (always, safety for when regenerated ids) -> when skipped because duplicate, report the old card thing
export const createCard = (learnablesBase: LearnableBase[]) =>
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

export const createLearnables = (
  state: WritableStateSource<LearnablesStoreType>,
  learnablesBase: LearnableBase[]
): string[] =>
  updateActiveBankWithResult(state, (bank) => {
    const newLearnables = learnablesBase.filter(
      (learnableBase, index, self) =>
        self.findIndex(
          (other) =>
            other.lexeme === learnableBase.lexeme && other.translation === learnableBase.translation
        ) === index &&
        !bank.learnables.some(
          (learnable) =>
            learnableBase.lexeme === learnable.lexeme &&
            learnableBase.translation === learnable.translation
        )
    )

    const fullNew = mapBaseToFullToLearnables(newLearnables)

    return {
      updatedBank: {
        ...bank,
        learnables: [...bank.learnables, ...fullNew]
      },
      result: fullNew.map((learnable) => learnable.id)
    }
  })

const updateGuesses = (guesses: boolean[], guess?: Guess): boolean[] => {
  if (!guess) return guesses
  return [...guesses.slice(1), guess === 'right']
}

export const updateCards = (cards: CardUpdater[]) =>
  updateActiveBank((b) => ({
    ...b,
    learnables: b.learnables.map((l) => {
      const updateVals = cards.find((ul) => ul.id === l.id)
      if (!updateVals) return l

      return {
        ...l,
        lexeme: updateVals.lexeme ?? l.lexeme,
        translation: updateVals.translation ?? l.translation,
        type: updateVals.type ?? l.type,
        notes: updateVals.notes ?? l.notes,
        guesses: {
          translation: updateGuesses(l.guesses.translation, updateVals.addGuessTranslation),
          lexeme: updateGuesses(l.guesses.lexeme, updateVals.addGuessLexeme)
        }
      }
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
