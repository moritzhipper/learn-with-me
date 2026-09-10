import { PracticeActive } from '@shared/types'
import { mapConfidencePercentToRating } from '../../../../../utils/genaral-utils'
import { ActivePracticeSummary } from '../../active-practice-comp/practice-summary-card/practice-summary-card'

export const createSummary = (practice: PracticeActive): ActivePracticeSummary => {
  const correctGuesses = practice.guessables.filter((g) => g.guess === 'right').length
  const wrongGuesses = practice.guessables.filter((g) => g.guess === 'wrong').length
  const unansweredGuesses = practice.guessables.filter((g) => g.guess === 'unanswered').length

  const guessesDone = correctGuesses + wrongGuesses
  const guessedRightPercent =
    guessesDone === 0 ? 0 : Math.round((correctGuesses / practice.guessables.length) * 100)

  return {
    correctGuesses,
    wrongGuesses,
    unansweredGuesses,
    guessedRightPercent,

    rating: mapConfidencePercentToRating(guessedRightPercent)
  }
}
