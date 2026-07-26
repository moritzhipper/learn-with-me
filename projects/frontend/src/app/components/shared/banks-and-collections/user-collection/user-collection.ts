import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { Collection } from '@shared/types'
import { ConfidenceAggregate } from '../../../../utils/genaral-utils'
import { ConfidenceStats } from '../../confidence/confidence-stats/confidence-stats'

@Component({
  selector: '[liz-user-collection]',
  imports: [ConfidenceStats, DatePipe],
  templateUrl: './user-collection.html',
  styleUrls: ['./user-collection.scss', '../banks-and-collections.scss']
})
export class UserCollection {
  collection = input.required<Collection>()
  confidence = input.required<ConfidenceAggregate>()
}
