import { WritableStateSource } from '@ngrx/signals'
import { Guessable, PracticeConfig } from '@shared/types'
import { LearnablesStoreType } from '../../types/types'
import { updateActiveBank } from './mutator-utils'

export const createPractice = (
  state: WritableStateSource<LearnablesStoreType>,
  config: PracticeConfig
) =>
  updateActiveBank(state, (b) => {
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
      learnableIDs: config.learnableIDs
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

export const endPracticeEarly = (state: WritableStateSource<LearnablesStoreType>) =>
  updateActiveBank(state, (b) => {
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

export const savePracticeToHistoryAndReset = (state: WritableStateSource<LearnablesStoreType>) =>
  updateActiveBank(state, (b) => {
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

const schwarzianShuffle = <T>(array: T[]): T[] => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
