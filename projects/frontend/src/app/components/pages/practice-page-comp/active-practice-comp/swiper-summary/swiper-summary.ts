import { Component } from '@angular/core'
import { PracticeRatingComp } from '../../../../shared/practice-rating-comp/practice-rating-comp'

@Component({
  selector: 'liz-swiper-summary',
  imports: [PracticeRatingComp],
  templateUrl: './swiper-summary.html',
  styleUrl: './swiper-summary.scss'
})
export class SwiperSummary {}
