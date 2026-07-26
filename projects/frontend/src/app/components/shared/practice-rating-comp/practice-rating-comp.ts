import { Component, input } from '@angular/core'
import { mapConfidencePercentToRating, PracticeRating } from '../../../utils/genaral-utils'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-practice-rating-comp',
  imports: [IconComp],
  templateUrl: './practice-rating-comp.html',
  styleUrl: './practice-rating-comp.scss',
  host: {
    '[class]': 'confidence()'
  }
})
export class PracticeRatingComp {
  confidence = input.required<PracticeRating, number>({
    transform: mapConfidencePercentToRating
  })
}
