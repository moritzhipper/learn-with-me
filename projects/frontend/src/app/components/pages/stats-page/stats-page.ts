import { DatePipe, KeyValuePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { PracticeActive } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { convertToDayPrecisionUTCDate } from '../../../utils/genaral-utils'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

type PracticeHistoryDay = Record<number, PracticeHistoryDaySummary>

type PracticeHistoryItemSummary = PracticeActive & {
  collectionName?: string
  right: number
  wrong: number
  unanswered: number
}

type PracticeHistoryDaySummary = {
  practices: PracticeHistoryItemSummary[]
  totalRight: number
  totalWrong: number
  totalUnanswered: number
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

  protected readonly practiceHistory = computed<PracticeHistoryDay>(() => {
    const collections = this.ls.activeBank().collections

    return this.ls.activeBank().practice.history.reduce<PracticeHistoryDay>((acc, item) => {
      const dayOfPractice = convertToDayPrecisionUTCDate(item.createdAt)

      const collectionName =
        item.type === 'collection'
          ? collections.find((c) => c.id === item.collectionId)?.name
          : undefined

      const summary: PracticeHistoryItemSummary = {
        ...item,
        collectionName,
        right: item.guessables.filter((r) => r.guess === 'right').length,
        wrong: item.guessables.filter((r) => r.guess === 'wrong').length,
        unanswered: item.guessables.filter((r) => r.guess === 'unanswered').length
      }

      const daySummary = acc[dayOfPractice]

      if (daySummary) {
        acc[dayOfPractice] = {
          practices: [...daySummary.practices, summary],
          totalRight: daySummary.totalRight + summary.right,
          totalWrong: daySummary.totalWrong + summary.wrong,
          totalUnanswered: daySummary.totalUnanswered + summary.unanswered
        }
      } else {
        acc[dayOfPractice] = {
          practices: [summary],
          totalRight: summary.right,
          totalWrong: summary.wrong,
          totalUnanswered: summary.unanswered
        }
      }
      return acc
    }, {})
  })
}
