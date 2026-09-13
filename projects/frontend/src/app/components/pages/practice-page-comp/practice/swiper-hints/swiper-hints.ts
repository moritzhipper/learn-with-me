import { Component } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { correctAnswerIcon, incorrectAnswerIcon, swipeHintIcon } from '../../../../../icon-registry'

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
  icons = { swipeHintIcon, correctAnswerIcon, incorrectAnswerIcon }
}
