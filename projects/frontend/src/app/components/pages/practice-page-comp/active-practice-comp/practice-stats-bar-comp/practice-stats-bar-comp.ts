import { Component, input, model, output } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixArrowDownSLine } from '@ng-icons/remixicon'
import { FocusCardState } from '../active-practice-comp'

@Component({
  selector: 'app-practice-stats-bar-comp',
  imports: [NgIcon],
  providers: [provideIcons({ remixArrowDownSLine })],
  templateUrl: './practice-stats-bar-comp.html',
  styleUrl: './practice-stats-bar-comp.scss'
})
export class PracticeStatsBarComp {
  isOpen = model<boolean>()
  isFinished = input.required<boolean>()
  cardState = input.required<FocusCardState>()
  edit = output<void>()
  quit = output<void>()

  toggle() {
    this.isOpen.update((v) => !v)
  }
}
