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
import {
  mapPracticeToSummaryDetailed,
  PracticeRating,
  PracticeSummaryDetailed
} from '../../../../../utils/genaral-utils'
import { InfoCard } from '../../../../shared/info-card/info-card'
import { PracticeRatingComp } from '../../../../shared/practice-rating-comp/practice-rating-comp'
import { PracticeStats } from '../../../../shared/practice-stats/practice-stats'
import { SwiperPageLayout } from '../swiper-page-layout/swiper-page-layout'

@Component({
  selector: 'liz-swiper-summary',
  imports: [
    PracticeRatingComp,
    NgIcon,
    AnimDelayWrapper,
    InfoCard,
    SwiperPageLayout,
    PracticeStats
  ],
  templateUrl: './swiper-summary.html',
  styleUrls: ['./swiper-summary.scss']
})
export class SwiperSummary {
  readonly summary = input.required<PracticeSummaryDetailed, PracticeActive>({
    transform: mapPracticeToSummaryDetailed,
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
    noteven: 'You showed up and that is what counts.',
    atleast: 'That means you tried!',
    okay: 'Not Bad.',
    good: 'Well Done!',
    excellent: 'Extremely impressive.'
  }

  finish = output<void>()
  continue = output<void>()
}
