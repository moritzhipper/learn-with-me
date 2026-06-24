import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { Guess, LearnableBase, LearnableBaseWithID, UserLearnable } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import { updateActiveBank } from '../mutators/mutator-utils'

type CardUpdater = {
  id: string
  addGuessTranslation?: Guess
  addGuessLexeme?: Guess
} & Partial<LearnableBase>

const updateGuesses = (guesses: boolean[], guess?: Guess): boolean[] => {
  if (!guess) return guesses
  return [...guesses.slice(1), guess === 'right']
}

export const withCardsCrud = <_>() =>
  signalStoreFeature(
    { state: type<LearnablesStoreType>() },
    withMethods((store) => ({
      createCards(
        cards: (LearnableBase | LearnableBaseWithID)[],
        rotateIDs: boolean = false
      ): string[] {
        const importedIDs: string[] = []
        updateActiveBank(store, (bank) => {
          const dateNow = new Date()

          const fullCards: UserLearnable[] = cards.map((l) => {
            const hasID = 'id' in l && l.id !== undefined
            const id = hasID && !rotateIDs ? l.id : crypto.randomUUID()

            return {
              ...l,
              id,
              createdAt: dateNow,
              guesses: {
                translation: [false, false, false, false, false],
                lexeme: [false, false, false, false, false]
              }
            }
          })

          importedIDs.push(...fullCards.map((l) => l.id))

          return {
            ...bank,
            learnables: [...bank.learnables, ...fullCards]
          }
        })
        return importedIDs
      },
      updateCards(cards: CardUpdater[]): void {
        updateActiveBank(store, (b) => ({
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
      },
      deleteCards(ids: string[]): void {
        updateActiveBank(store, (b) => {
          const updatedLearnables = b.learnables.filter((l) => !ids.includes(l.id))
          const updatedCollections = b.collections.map((c) => ({
            ...c,
            cardIds: c.cardIds.filter((cardId) => !ids.includes(cardId))
          }))

          const practiceHoldsDeleted = !!b.practice.active?.guessables.some((g) =>
            ids.includes(g.id)
          )
          return {
            ...b,
            learnables: updatedLearnables,
            collections: updatedCollections,
            practice: practiceHoldsDeleted ? { ...b.practice, active: null } : b.practice
          }
        })
      }
    }))
  )
