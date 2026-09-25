import { signalStoreFeature, type, withMethods } from '@ngrx/signals'
import { Guess, Guessable, PracticeActive, PracticeConfig, UserLearnable } from '@shared/types'
import type { LearnablesStoreType } from '../../types/store-types'
import { mapPracticeToSummary, mapSummaryToSummaryDetailed } from '../../utils/genaral-utils'
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
  guessableField: PracticeConfig['guessableField']
): UserLearnable['guesses'] => {
  if (guessableField === 'translation')
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
            guessableField: config.guessableField,
            learnableIDs: config.learnableIDs,
            type: config.type,
            isFinished: false,
            swipeCount: 0
          }

          let practice: PracticeActive

          if (config.type === 'collection') {
            practice = {
              ...basePractice,
              type: 'collection',
              collectionId: config.collectionId
            }
          } else if (config.type === 'added-on-day') {
            practice = {
              ...basePractice,

              type: 'added-on-day',
              dayCardsAddedUTC: config.dayCardsAddedUTC
            }
          } else {
            practice = {
              ...basePractice,
              type: 'custom'
            }
          }

          return {
            ...b,
            practice: {
              ...b.practice,
              active: practice
            }
          }
        })
      },
      giveUpOnPractice() {
        updateActiveBank(store, (b) => {
          const currentPractice = b.practice.active
          if (!currentPractice) return b

          // set index to end
          const finishedPractice = {
            ...currentPractice,
            guessableIndex: currentPractice.guessables.length,
            isFinished: true
          }

          return {
            ...b,
            practice: {
              ...b.practice,
              active: finishedPractice
            }
          }
        })
      },
      setGuessToPractice(guess: Guess) {
        updateActiveBank(store, (b) => {
          const activePractice = b.practice.active
          if (!activePractice) return b

          const cardIndex = activePractice.guessableIndex
          if (cardIndex >= activePractice.guessables.length) return b

          const updatedGuessables = activePractice.guessables.map((g, index) =>
            index === cardIndex ? { ...g, guess } : g
          )

          const updatedCards = b.learnables.map((l) => {
            if (l.id !== activePractice.guessables[cardIndex].id) return l

            return {
              ...l,
              guesses: updateGuesses(guess, l.guesses, activePractice.guessableField)
            }
          })

          const isFinished = activePractice.guessableIndex >= activePractice.guessables.length - 1

          return {
            ...b,
            learnables: updatedCards,
            practice: {
              ...b.practice,
              active: {
                ...activePractice,
                guessableIndex: cardIndex + 1,
                guessables: updatedGuessables,
                isFinished,
                swipeCount: activePractice.swipeCount + 1
              }
            }
          }
        })
      },
      resetPracticeAndSaveToHistory() {
        updateActiveBank(store, (b) => {
          const currentPractice = b.practice.active
          if (!currentPractice) return b
          const summary = mapPracticeToSummary(currentPractice)

          // early finished practices do not count into history
          if (mapSummaryToSummaryDetailed(summary).rating !== 'noteven') {
            return {
              ...b,
              practice: {
                ...b.practice,
                active: null,
                history: [summary, ...b.practice.history]
              }
            }
          } else {
            return {
              ...b,
              practice: {
                ...b.practice,
                active: null
              }
            }
          }
        })
      },
      continuePractice() {
        updateActiveBank(store, (b) => {
          // Move right guesses to begin
          // Move not right guesses to end, reshuffle
          // Move pointer to right guess length index to start guessing false cards again

          const practice = b.practice.active
          if (!practice) return b

          const rightGuesses: Guessable[] = practice.guessables.filter((g) => g.guess === 'right')

          const wrongAndUnanswered: Guessable[] = schwarzianShuffle(
            practice.guessables.filter((g) => g.guess !== 'right')
          )

          return {
            ...b,
            practice: {
              ...b.practice,
              active: {
                ...practice,
                guessables: [...rightGuesses, ...wrongAndUnanswered],
                guessableIndex: rightGuesses.length,
                isFinished: false
              }
            }
          }
        })
      }
    }))
  )
