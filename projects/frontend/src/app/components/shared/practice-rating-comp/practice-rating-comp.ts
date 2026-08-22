import { Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import {
  emptyStarRatingIcon,
  favoriteIcon,
  meteorRatingIcon,
  starRatingIcon
} from '../../../icon-registry'
import { mapConfidencePercentToRating, PracticeRating } from '../../../utils/genaral-utils'

@Component({
  selector: 'app-practice-rating-comp',
  imports: [NgIcon],
  templateUrl: './practice-rating-comp.html',
  styleUrl: './practice-rating-comp.scss',
  host: {
    '[class]': 'confidence()'
  }
})
export class PracticeRatingComp {
  protected readonly icons = {
    emptyStarRatingIcon,
    favoriteIcon,
    meteorRatingIcon,
    starRatingIcon
  }
  confidence = input.required<PracticeRating, number>({
    transform: mapConfidencePercentToRating
  })
}
