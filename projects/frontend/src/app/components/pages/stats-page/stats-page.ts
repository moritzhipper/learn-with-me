import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { PracticeActive } from '@shared/types'
import { LearnablesStore } from '../../../store/learnables-store'
import { convertToDayPrecisionUTCDate } from '../../../utils/genaral-utils'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { PracticeTimeline } from '../../shared/practice-timeline/practice-timeline'

type PracticeHistoryDay = {
  day: number
  summary: PracticeHistoryDaySummary
}

type PracticeHistoryItemSummary = PracticeActive & {
  collectionName?: string
  right: number
  wrong: number
  unanswered: number
}

type PracticeHistoryDaySummary = {
  practices: PracticeHistoryItemSummary[]
  totalGuesses: number
}

@Component({
  selector: 'app-stats-page',
  imports: [PageHeaderComp, PageIconComp, DatePipe, IconComp, PracticeTimeline],
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.scss',
  host: { class: 'page mid' }
})
export class StatsPage {
  private readonly ls = inject(LearnablesStore)
  protected readonly practiceHistory = computed(() => this.ls.activeBank().practice.history)

  protected readonly practiceHistoryDays = computed<PracticeHistoryDay[]>(() => {
    const collections = this.ls.activeBank().collections

    const record = this.practiceHistory()
      .sort(this.practiceComparator)
      .reverse()
      .reduce<Record<number, PracticeHistoryDaySummary>>((acc, item) => {
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
        const totalGuesses = summary.right + summary.wrong

        if (daySummary) {
          acc[dayOfPractice] = {
            practices: [...daySummary.practices, summary],
            totalGuesses: daySummary.totalGuesses + totalGuesses
          }
        } else {
          acc[dayOfPractice] = {
            practices: [summary],
            totalGuesses: summary.right + summary.wrong
          }
        }
        return acc
      }, {})

    return Object.entries(record).map(([day, summary]) => ({
      day: Number(day),
      summary
    }))
  })

  private practiceComparator(a: PracticeActive, b: PracticeActive): number {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  }

  protected scrollToDay(day: number): void {
    const element = document.getElementById(`day-${day}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
