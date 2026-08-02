import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { Collection } from '@shared/types'
import { ConfidenceAggregate } from '../../../../utils/genaral-utils'
import { ConfidenceStats } from '../../confidence/confidence-stats/confidence-stats'
import { HeaderLink } from '../../header-link/header-link'
import { PracticeRatingComp } from '../../practice-rating-comp/practice-rating-comp'

@Component({
  selector: 'liz-user-collection-header',
  imports: [HeaderLink, PracticeRatingComp, ConfidenceStats, DatePipe],
  templateUrl: './user-collection-header.html',
  styleUrls: ['./user-collection-header.scss', '../banks-and-collections.scss'],
  host: {
    class: 'header'
  }
})
export class UserCollectionHeader {
  collection = input.required<Collection>()
  confidence = input.required<ConfidenceAggregate>()
}
