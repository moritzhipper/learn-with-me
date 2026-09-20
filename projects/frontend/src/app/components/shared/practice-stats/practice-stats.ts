import { Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { PracticeSummary } from '@shared/types'
import {
  correctAnswerIcon,
  incorrectAnswerIcon,
  unansweredAnswerIcon
} from '../../../icon-registry'

@Component({
  selector: 'liz-practice-stats',
  imports: [NgIcon],
  templateUrl: './practice-stats.html',
  styleUrl: './practice-stats.scss'
})
export class PracticeStats {
  readonly guesses = input.required<PracticeSummary['guesses']>()

  protected icons = {
    correctAnswerIcon,
    incorrectAnswerIcon,
    unansweredAnswerIcon
  }
}
