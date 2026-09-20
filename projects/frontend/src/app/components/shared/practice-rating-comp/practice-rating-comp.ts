import { Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import {
  emptyStarRatingIcon,
  favoriteIcon,
  meteorRatingIcon,
  starRatingIcon
} from '../../../icon-registry'
import { PracticeRating } from '../../../utils/genaral-utils'

@Component({
  selector: 'app-practice-rating-comp',
  imports: [NgIcon],
  templateUrl: './practice-rating-comp.html',
  styleUrl: './practice-rating-comp.scss'
})
export class PracticeRatingComp {
  protected readonly icons = {
    emptyStarRatingIcon,
    favoriteIcon,
    meteorRatingIcon,
    starRatingIcon
  }
  readonly rating = input.required<PracticeRating>()
}
