import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { PracticeActive } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

type PracticeHistoryDay = {
  day: Date
  practices: PracticeHistoryItemSummary[]
}
type PracticeHistoryItemSummary = PracticeActive & {
  right: number
  wrong: number
  unanswered: number
}

@Component({
  selector: 'app-stats-page',
  imports: [PageHeaderComp, PageIconComp, DatePipe],
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.scss',
  host: { class: 'page mid' }
})
export class StatsPage {
  private readonly ls = inject(LearnablesStore)

  protected readonly practiceHistory = computed<PracticeHistoryItemSummary[]>(() =>
    this.ls.activeBank().practice.history.map((item) => ({
      ...item,
      right: item.guessables.filter((r) => r.guess === 'right').length,
      wrong: item.guessables.filter((r) => r.guess === 'wrong').length,
      unanswered: item.guessables.filter((r) => r.guess === 'unanswered').length
    }))
  )
}
