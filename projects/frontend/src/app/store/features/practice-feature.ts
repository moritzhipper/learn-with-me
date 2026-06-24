import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { Guess, Guessable, PracticeConfig, UserLearnable } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import { updateActiveBank } from '../mutators/mutator-utils'

const schwarzianShuffle = <T>(array: T[]): T[] => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const updateGuesses = (
  guess: Guess,
  toUpdate: UserLearnable['guesses'],
  direction: PracticeConfig['direction']
): UserLearnable['guesses'] => {
  if (direction === 'guessTranslation')
    return {
      ...toUpdate,
      translation: [...toUpdate.translation.slice(1), guess === 'right']
    }

  return {
    ...toUpdate,
    lexeme: [...toUpdate.lexeme.slice(1), guess === 'right']
  }
}

export const withPracticeFeature = <_>() =>
  signalStoreFeature(
    { state: type<LearnablesStoreType>() },
    withMethods((store) => ({
      startPractice(config: PracticeConfig) {
        updateActiveBank(store, (b) => {
          const shuffledIds = schwarzianShuffle(config.learnableIDs)
          const guessables: Guessable[] = shuffledIds.map((id) => ({
            id,
            guess: 'unanswered'
          }))

          const basePractice = {
            guessables,
            guessableIndex: 0,
            createdAt: new Date(),
            direction: config.direction,
            learnableIDs: config.learnableIDs,
            type: config.type
          }

          if (config.type === 'collection') {
            return {
              ...b,
              practice: {
                ...b.practice,
                active: {
                  ...basePractice,
                  type: 'collection',
                  collectionId: config.collectionId
                }
              }
            }
          } else if (config.type === 'added-on-day') {
            return {
              ...b,
              practice: {
                ...b.practice,
                active: {
                  ...basePractice,
                  type: 'added-on-day',
                  dayCardsAddedUTC: config.dayCardsAddedUTC
                }
              }
            }
          } else {
            return {
              ...b,
              practice: {
                ...b.practice,
                active: {
                  ...basePractice,
                  type: 'custom'
                }
              }
            }
          }
        })
      },
      endPracticePrematurely() {
        updateActiveBank(store, (b) => {
          const currentPractice = b.practice.active
          if (!currentPractice) return b

          // set index to end
          const finishedPractice = {
            ...currentPractice,
            guessableIndex: currentPractice.guessables.length
          }

          return {
            ...b,
            practice: {
              active: finishedPractice,
              history: [...b.practice.history, finishedPractice]
            }
          }
        })
      },
      setGuessToPractice(guess: Guess) {
        updateActiveBank(store, (b) => {
          const currentPractice = b.practice.active
          if (!currentPractice) return b

          const cardIndex = currentPractice.guessableIndex
          if (cardIndex >= currentPractice.guessables.length) return b

          const updatedGuessables = currentPractice.guessables.map((g, index) =>
            index === cardIndex ? { ...g, guess } : g
          )

          const updatedCards = b.learnables.map((l) => {
            if (l.id !== currentPractice.guessables[cardIndex].id) return l

            return {
              ...l,
              guesses: updateGuesses(guess, l.guesses, currentPractice.direction)
            }
          })

          return {
            ...b,
            learnables: updatedCards,
            practice: {
              ...b.practice,
              active: {
                ...currentPractice,
                guessableIndex: cardIndex + 1,
                guessables: updatedGuessables
              }
            }
          }
        })
      },
      resetPracticeAndSaveToHistory() {
        updateActiveBank(store, (b) => {
          const currentPractice = b.practice.active
          if (!currentPractice) return b
          return {
            ...b,
            practice: {
              ...b.practice,
              active: null,
              history: [currentPractice, ...b.practice.history]
            }
          }
        })
      }
    }))
  )
