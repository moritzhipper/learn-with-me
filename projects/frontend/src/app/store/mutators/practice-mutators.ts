import { Guess, Guessable, Practice, UserLearnable } from '@shared/types'
import { LearnablesStoreType } from '../../types_and_schemas/types'
import { updateActiveBank } from './mutator-utils'

export const addGuessToLearnable = (
  learnable: UserLearnable,
  guess: Guess,
  direction: Practice['direction']
): UserLearnable => {
  const updateGuesses = (guesses: boolean[], isCorrect: boolean): boolean[] => [
    ...guesses.slice(1),
    isCorrect
  ]

  if (direction === 'forward') {
    return {
      ...learnable,
      guesses: {
        ...learnable.guesses,
        translation: updateGuesses(learnable.guesses.translation, guess === 'right')
      }
    }
  } else {
    return {
      ...learnable,
      guesses: {
        ...learnable.guesses,
        lexeme: updateGuesses(learnable.guesses.lexeme, guess === 'right')
      }
    }
  }
}

export const updateGuessables = (guessables: Guessable[], id: string, guess: Guess): Guessable[] =>
  guessables.map((g) => (g.id === id ? { ...g, guess } : g))

export const startPractice =
  (ids: string[], direction: Practice['direction']) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      // randomize order of ids to prevent memorization of order
      const shuffledIds = schwarzianShuffle(ids)
      const guessables: Guessable[] = shuffledIds.map((id) => ({
        id,
        guess: 'unanswered'
      }))

      return {
        ...b,
        practice: {
          ...b.practice,
          current: {
            guessables,
            index: 0,
            guessableIndex: 0,
            createdAt: new Date(),
            direction
          }
        }
      }
    })

export const setGuess =
  (guess: Guess) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      // no practice running
      const practice = b.practice.current
      if (!practice) return b

      // practice already finished
      const currentGuessable = practice.guessables[practice.guessableIndex]
      if (!currentGuessable) return b

      const updatedlearnables = b.learnables.map((l) =>
        l.id === currentGuessable.id ? addGuessToLearnable(l, guess, practice.direction) : l
      )

      return {
        ...b,
        learnables: updatedlearnables,
        practice: {
          ...b.practice,
          current: {
            ...practice,
            guessableIndex: practice.guessableIndex + 1,
            guessables: updateGuessables(practice.guessables, currentGuessable.id, guess)
          }
        }
      }
    })

export const quitPracticeEarly =
  () =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const currentPractice = b.practice.current
      if (!currentPractice) return b

      // set index to end
      const finishedPractice = {
        ...currentPractice,
        guessableIndex: currentPractice.guessables.length
      }

      return {
        ...b,
        practice: {
          current: finishedPractice,
          history: [...b.practice.history, finishedPractice]
        }
      }
    })

export const removePractice =
  () =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const currentPractice = b.practice.current
      if (!currentPractice) return b
      return {
        ...b,
        practice: {
          ...b.practice,
          current: null,
          history: [currentPractice, ...b.practice.history]
        }
      }
    })

const schwarzianShuffle = <T>(array: T[]): T[] => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
