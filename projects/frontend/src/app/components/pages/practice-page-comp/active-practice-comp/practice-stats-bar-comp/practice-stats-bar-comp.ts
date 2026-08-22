import { Component, input, model, output } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { collapseIcon } from '../../../../../icon-registry'
import { FocusCardState } from '../active-practice-comp'

@Component({
  selector: 'app-practice-stats-bar-comp',
  imports: [NgIcon],
  templateUrl: './practice-stats-bar-comp.html',
  styleUrl: './practice-stats-bar-comp.scss'
})
export class PracticeStatsBarComp {
  protected readonly collapseIcon = collapseIcon
  isOpen = model<boolean>()
  isFinished = input.required<boolean>()
  cardState = input.required<FocusCardState>()
  edit = output<void>()
  quit = output<void>()

  toggle() {
    this.isOpen.update((v) => !v)
  }
}
