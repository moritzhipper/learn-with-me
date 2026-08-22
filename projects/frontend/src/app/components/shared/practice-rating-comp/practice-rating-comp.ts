import { Component, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixHeartsFill, remixMeteorFill, remixStarFill, remixStarLine } from '@ng-icons/remixicon'
import { mapConfidencePercentToRating, PracticeRating } from '../../../utils/genaral-utils'

@Component({
  selector: 'app-practice-rating-comp',
  imports: [NgIcon],
  providers: [provideIcons({ remixHeartsFill, remixMeteorFill, remixStarFill, remixStarLine })],
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
