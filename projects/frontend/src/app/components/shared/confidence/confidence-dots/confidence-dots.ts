import { Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { learnLanguageIcon, speakLanguageIcon } from '../../../../icon-registry'
import { ConfidenceAggregate } from '../../../../utils/genaral-utils'

@Component({
  selector: 'liz-confidence-dots',
  imports: [NgIcon],
  templateUrl: './confidence-dots.html',
  styleUrl: './confidence-dots.scss'
})
export class ConfidenceDots {
  protected readonly icons = {
    learnLanguageIcon,
    speakLanguageIcon
  }
  private readonly guessesPerField = 5
  readonly confidence = input.required<ConfidenceAggregate>()

  protected dotsArray = Array.from({ length: this.guessesPerField }, (_, i) => i)
}
