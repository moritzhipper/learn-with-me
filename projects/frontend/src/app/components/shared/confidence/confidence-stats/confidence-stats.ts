import { Component, input } from '@angular/core'
import { ConfidenceAggregate } from '../../../../utils/genaral-utils'

@Component({
  selector: 'liz-confidence-stats',
  imports: [],
  templateUrl: './confidence-stats.html',
  styles: `
    :host {
      display: block;
    }
  `
})
export class ConfidenceStats {
  confidence = input.required<ConfidenceAggregate>()
}
