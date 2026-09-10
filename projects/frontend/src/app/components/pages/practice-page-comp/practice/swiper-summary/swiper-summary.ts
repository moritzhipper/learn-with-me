import { Component, input, output } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { AnimDelayWrapper } from '../../../../../directives/anim-delay-wrapper'
import { practiceSpeedIcon } from '../../../../../icon-registry'
import { PracticeRating } from '../../../../../utils/genaral-utils'
import { PracticeRatingComp } from '../../../../shared/practice-rating-comp/practice-rating-comp'

export type ActivePracticeSummary = {
  correctGuesses: number
  wrongGuesses: number
  unansweredGuesses: number
  guessedRightPercent: number
  rating: PracticeRating
}

@Component({
  selector: 'liz-swiper-summary',
  imports: [PracticeRatingComp, NgIcon, AnimDelayWrapper],
  templateUrl: './swiper-summary.html',
  styleUrl: './swiper-summary.scss'
})
export class SwiperSummary {
  readonly summary = input.required<ActivePracticeSummary>()

  protected readonly subHeader: Record<PracticeRating, string> = {
    noteven: 'Well, at least you showed up :)',
    atleast: 'That means you tried!',
    okay: 'Not Bad.',
    good: 'Well Done!',
    excellent: "Are you sure you didn't cheat?"
  }

  finish = output<void>()
  continue = output<void>()

  practiceSpeedIcon = practiceSpeedIcon
}
