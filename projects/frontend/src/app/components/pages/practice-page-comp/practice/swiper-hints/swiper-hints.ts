import { Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import {
  correctAnswerIcon,
  incorrectAnswerIcon,
  swipeHintIcon,
  tapIcon
} from '../../../../../icon-registry'

export type HintType = 'tap' | 'swipe'

@Component({
  selector: 'liz-swiper-hints',
  imports: [NgIcon],
  templateUrl: './swiper-hints.html',
  styleUrl: './swiper-hints.scss',
  host: {
    'animate.leave': 'hints-leave'
  }
})
export class SwiperHints {
  type = input<HintType>('tap')

  protected icons = { swipeHintIcon, correctAnswerIcon, incorrectAnswerIcon, tapIcon }
}
