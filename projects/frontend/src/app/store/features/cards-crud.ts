import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { LearnableBase, LearnableBaseWithID, UserLearnable } from '@shared/types'
import type { LearnablesStoreType } from '../../types/store-types'
import { initialGuesses } from '../initial-states'
import { learnablesMatch, updateActiveBank } from '../mutators/mutator-utils'

type CardUpdater = {
  id: string
} & Partial<LearnableBase>

export type ImportCardsResult = {
  // IDs for every card referenced by this operation:
  // - newly added cards
  // - cards skipped because the ID already exists
  // - cards skipped because the content already exists
  // Returning all IDs allows follow-up actions, such as adding cards to collections.
  // idsOfAllAdded holds new card ids and both duplicate references.
  idsOfAll: string[]
  idsOfNewlyAdded: string[]
  idsOfDuplicates: { importedID: string; existingDuplicateID: string; reason: 'id' | 'content' }[]
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
      importCards(
        cards: (LearnableBase | LearnableBaseWithID | UserLearnable)[]
      ): ImportCardsResult {
        const newCardIDs: string[] = []
        const duplicates: ImportCardsResult['idsOfDuplicates'] = []

        updateActiveBank(store, (bank) => {
          const dateNow = new Date()

          const newCards: UserLearnable[] = []

          for (const card of cards) {
            const id = 'id' in card ? card.id : crypto.randomUUID()

            const idDuplicate = bank.learnables.find((l) => l.id === id)
            if (idDuplicate) {
              duplicates.push({ importedID: id, existingDuplicateID: idDuplicate.id, reason: 'id' })
              continue
            }

            const contentDuplicate = bank.learnables.find((bankCard) =>
              learnablesMatch(bankCard, card)
            )

            if (contentDuplicate) {
              duplicates.push({
                importedID: id,
                existingDuplicateID: contentDuplicate.id,
                reason: 'content'
              })
              continue
            }

            newCardIDs.push(id)

            const guesses: UserLearnable['guesses'] =
              'guesses' in card ? card.guesses : { ...initialGuesses }

            newCards.push({
              ...card,
              id,
              guesses,
              createdAt: dateNow
            })
          }

          return {
            ...bank,
            learnables: [...newCards, ...bank.learnables]
          }
        })

        return {
          idsOfAll: [...newCardIDs, ...duplicates.map((d) => d.existingDuplicateID)],
          idsOfNewlyAdded: newCardIDs,
          idsOfDuplicates: duplicates
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
              notes: updateVals.notes ?? l.notes
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
