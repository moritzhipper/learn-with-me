import { Component, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixUserFollowLine, remixUserVoiceLine } from '@ng-icons/remixicon'
import { ConfidenceAggregate } from '../../../../utils/genaral-utils'

type ConfidenceDotsConfig = ConfidenceAggregate

@Component({
  selector: 'liz-confidence-dots',
  imports: [NgIcon],
  providers: [provideIcons({ remixUserFollowLine, remixUserVoiceLine })],
  templateUrl: './confidence-dots.html',
  styleUrl: './confidence-dots.scss'
})
export class ConfidenceDots {
  private readonly guessesPerField = 5
  readonly confidence = input.required<ConfidenceDotsConfig>()

  protected dotsArray = Array.from({ length: this.guessesPerField }, (_, i) => i)
}
