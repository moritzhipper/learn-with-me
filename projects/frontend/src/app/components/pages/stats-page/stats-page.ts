import { DatePipe, KeyValuePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { PracticeActive } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { convertToDayPrecisionUTCDate } from '../../../utils/genaral-utils'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

type PracticeHistoryDay = Record<number, PracticeHistoryItemSummary[]>

type PracticeHistoryItemSummary = PracticeActive & {
  right: number
  wrong: number
  unanswered: number
}

@Component({
  selector: 'app-stats-page',
  imports: [PageHeaderComp, PageIconComp, DatePipe, KeyValuePipe, IconComp],
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.scss',
  host: { class: 'page mid' }
})
export class StatsPage {
  private readonly ls = inject(LearnablesStore)

  protected readonly practiceHistory = computed<PracticeHistoryDay>(() =>
    this.ls.activeBank().practice.history.reduce<PracticeHistoryDay>((acc, item) => {
      const dayOfPractice = convertToDayPrecisionUTCDate(item.createdAt)
      const summary: PracticeHistoryItemSummary = {
        ...item,
        right: item.guessables.filter((r) => r.guess === 'right').length,
        wrong: item.guessables.filter((r) => r.guess === 'wrong').length,
        unanswered: item.guessables.filter((r) => r.guess === 'unanswered').length
      }

      if (acc[dayOfPractice]) {
        acc[dayOfPractice] = [...acc[dayOfPractice], summary]
      } else {
        acc[dayOfPractice] = [summary]
      }
      return acc
    }, {})
  )
}
