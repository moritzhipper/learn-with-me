import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { Collection } from '@shared/types'
import { ConfidenceAggregate } from '../../../../utils/genaral-utils'
import { ConfidenceStats } from '../../confidence/confidence-stats/confidence-stats'
import { PracticeRatingComp } from '../../practice-rating-comp/practice-rating-comp'

@Component({
  selector: '[liz-user-collection]',
  imports: [ConfidenceStats, DatePipe, PracticeRatingComp],
  templateUrl: './user-collection.html',
  styleUrls: ['./user-collection.scss', '../banks-and-collections.scss'],
  host: {
    class: 'cards-stack-wrapper'
  }
})
export class UserCollection {
  collection = input.required<Collection>()
  confidence = input.required<ConfidenceAggregate>()
}
