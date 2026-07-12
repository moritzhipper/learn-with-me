import { Component, input } from '@angular/core'
import { ConfidenceAggregate } from 'projects/frontend/src/app/utils/genaral-utils'

@Component({
  selector: 'liz-confidence-stats',
  imports: [],

  templateUrl: './confidence-stats.html',
  styles: `
    :host {
      display: content;
    }
  `
})
export class ConfidenceStats {
  confidence = input.required<ConfidenceAggregate>()
}
