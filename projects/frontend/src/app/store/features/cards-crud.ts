import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { Guess, LearnableBase, LearnableBaseWithID, UserLearnable } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import { learnablesMatch, updateActiveBank } from '../mutators/mutator-utils'

type CardUpdater = {
  id: string
  addGuessTranslation?: Guess
  addGuessLexeme?: Guess
} & Partial<LearnableBase>

type CreateCardsResult = {
  // IDs for every card referenced by this operation:
  // - newly added cards
  // - cards skipped because the ID already exists
  // - cards skipped because the content already exists
  // Returning all IDs allows follow-up actions, such as adding cards to collections.
  // idsOfAllAdded holds new card ids and both duplicate references.
  idsOfAllAdded: string[]

  idsOfIDDuplicates: string[]
  idsOfContentDuplicates: string[]
}

const updateGuesses = (guesses: boolean[], guess?: Guess): boolean[] => {
  if (!guess) return guesses
  return [...guesses.slice(1), guess === 'right']
}

export const withCardsCrud = <_>() =>
  signalStoreFeature(
    { state: type<LearnablesStoreType>() },
    withMethods((store) => ({
      /**
       * Imports cards and returns the result of the operation.
       * @param cards The cards to be imported.
       * @returns An object containing the IDs of all added cards, ID duplicates, and content duplicates.
       */
      importCards(cards: (LearnableBase | LearnableBaseWithID)[]): CreateCardsResult {
        const addedCardIDs: string[] = []
        const skippedDupIDs: string[] = []
        const skippedDupCards: string[] = []

        updateActiveBank(store, (bank) => {
          const dateNow = new Date()

          const newCards: UserLearnable[] = []

          for (const card of cards) {
            const id = 'id' in card ? card.id : crypto.randomUUID()

            const idDuplicate = bank.learnables.find((l) => l.id === id)
            if (idDuplicate) {
              skippedDupIDs.push(idDuplicate.id)
              addedCardIDs.push(idDuplicate.id)
              continue
            }

            const contentDuplicate = bank.learnables.find((bankCard) =>
              learnablesMatch(bankCard, card)
            )
            if (contentDuplicate) {
              addedCardIDs.push(contentDuplicate.id)
              skippedDupCards.push(contentDuplicate.id)
              continue
            }

            addedCardIDs.push(id)
            newCards.push({
              ...card,
              id,
              createdAt: dateNow,
              guesses: {
                translation: [false, false, false, false, false],
                lexeme: [false, false, false, false, false]
              }
            })
          }

          return {
            ...bank,
            learnables: [...bank.learnables, ...newCards]
          }
        })
        return {
          idsOfAllAdded: addedCardIDs,
          idsOfIDDuplicates: skippedDupIDs,
          idsOfContentDuplicates: skippedDupCards
        }
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
