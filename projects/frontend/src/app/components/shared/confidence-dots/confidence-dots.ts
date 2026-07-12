import { Component, input } from '@angular/core'
import { ConfidenceAggregate } from '../../../utils/genaral-utils'
import { IconComp } from '../icon-comp/icon-comp'

type ConfidenceDotsConfig = ConfidenceAggregate

@Component({
  selector: 'liz-confidence-dots',
  imports: [IconComp],
  templateUrl: './confidence-dots.html',
  styleUrl: './confidence-dots.scss'
})
export class ConfidenceDots {
  private readonly guessesPerField = 5
  readonly confidence = input.required<ConfidenceDotsConfig>()

  protected dotsArray = Array.from({ length: this.guessesPerField }, (_, i) => i)
}
