import { Component, input, output } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { PracticeActive } from '@shared/types'
import { AnimDelayWrapper } from '../../../../../directives/anim-delay-wrapper'
import {
  correctAnswerIcon,
  incorrectAnswerIcon,
  practiceFinishIcon,
  practiceSpeedIcon,
  unansweredAnswerIcon
} from '../../../../../icon-registry'
import { mapConfidencePercentToRating, PracticeRating } from '../../../../../utils/genaral-utils'
import { InfoCard } from '../../../../shared/info-card/info-card'
import { PracticeRatingComp } from '../../../../shared/practice-rating-comp/practice-rating-comp'
import { SwiperPageLayout } from '../../swiper-page-layout/swiper-page-layout'

export type ActivePracticeSummary = {
  correctGuesses: number
  wrongGuesses: number
  unansweredGuesses: number
  guessedRightPercent: number
  rating: PracticeRating
}

@Component({
  selector: 'liz-swiper-summary',
  imports: [PracticeRatingComp, NgIcon, AnimDelayWrapper, InfoCard, SwiperPageLayout],
  templateUrl: './swiper-summary.html',
  styleUrls: ['./swiper-summary.scss']
})
export class SwiperSummary {
  readonly summary = input.required<ActivePracticeSummary, PracticeActive>({
    transform: this.toSummary,
    alias: 'practice'
  })

  icons = {
    practiceSpeedIcon,
    practiceFinishIcon,
    correctAnswerIcon,
    incorrectAnswerIcon,
    unansweredAnswerIcon
  }

  protected readonly subHeader: Record<PracticeRating, string> = {
    noteven: 'Well, at least you showed up :)',
    atleast: 'That means you tried!',
    okay: 'Not Bad.',
    good: 'Well Done!',
    excellent: 'Extremely impressive.'
  }

  finish = output<void>()
  continue = output<void>()

  toSummary(practice: PracticeActive) {
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
}
