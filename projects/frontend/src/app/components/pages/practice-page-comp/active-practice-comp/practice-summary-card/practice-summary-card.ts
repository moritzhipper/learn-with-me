import { Component, computed, input } from '@angular/core'
import { PracticeRating } from '../../../../../utils/genaral-utils'
import { LarryBig } from '../../../../shared/larries/larry-big/larry-big'
import { PracticeRatingComp } from '../../../../shared/practice-rating-comp/practice-rating-comp'

export type ActivePracticeSummary = {
  correctGuesses: number
  wrongGuesses: number
  unansweredGuesses: number
  guessedRightPercent: number
  rating: PracticeRating
}

@Component({
  selector: 'app-practice-summary-card',
  imports: [PracticeRatingComp, LarryBig],
  templateUrl: './practice-summary-card.html',
  styleUrl: './practice-summary-card.scss',
  host: {
    '[class.concealed]': 'concealed()'
  }
})
export class PracticeSummaryCard {
  concealed = input<boolean>(true)
  summary = input.required<ActivePracticeSummary>()

  text = computed(() => this.textConfig[this.summary().rating])

  private readonly textConfig: Record<PracticeRating, string> = {
    noteven: 'Well, at least you showed up',
    atleast: 'That means you tried!',
    okay: 'Not Bad.',
    good: 'Well Done!',
    excellent: "Are you sure you didn't cheat?"
  }
}
