import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { PracticeSummary } from '@shared/types'
import { completedTimelineIcon, statsIcon } from '../../../icon-registry'
import { LearnablesStore } from '../../../store/learnables-store'
import {
  convertToDayPrecisionUTCDate,
  mapSummaryToSummaryDetailed,
  PracticeRating,
  PracticeSummaryDetailed
} from '../../../utils/genaral-utils'
import { InfoCard } from '../../shared/info-card/info-card'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PracticeRatingComp } from '../../shared/practice-rating-comp/practice-rating-comp'
import { PracticeStats } from '../../shared/practice-stats/practice-stats'
import { PracticeTimeline } from '../../shared/practice-timeline/practice-timeline'
import { PageWrapper } from '../page-wrapper/page-wrapper'

type PracticeHistoryDay = {
  day: number
  summary: Pick<PracticeSummary, 'guesses' | 'swipeCount'>
  detailedSummaries: PracticeSummaryDetailed[]
}

type RatingSummary = {
  rating: PracticeRating
  count: number
}

@Component({
  selector: 'app-stats-page',
  imports: [
    PageHeaderComp,
    DatePipe,
    PracticeTimeline,
    PageWrapper,
    InfoCard,
    PracticeStats,
    PracticeRatingComp
  ],
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.scss'
})
export class StatsPage {
  private readonly ls = inject(LearnablesStore)
  protected readonly practiceHistory = computed(() => this.ls.activeBank().practice.history)

  protected readonly icons = {
    statsIcon,
    completedTimelineIcon
  }

  protected readonly ratingSummary = computed<RatingSummary[]>(() => {
    const history = this.ls.activeBank().practice.history
    const ratings: PracticeRating[] = ['excellent', 'good', 'okay', 'atleast']

    return ratings.map((rating) => ({
      rating,
      count: history.filter((s) => mapSummaryToSummaryDetailed(s).rating === rating).length
    }))
  })

  protected readonly practiceHistoryDays = computed<PracticeHistoryDay[]>(() => {
    const collections = this.ls.activeBank().collections

    const record: Record<number, Omit<PracticeHistoryDay, 'day'>> = this.practiceHistory()
      .sort(this.practiceComparator)
      .reverse()
      .reduce<Record<number, Omit<PracticeHistoryDay, 'day'>>>((acc, item) => {
        const dayOfPractice = convertToDayPrecisionUTCDate(item.createdAt)
        const daySummary = acc[dayOfPractice]
        const summaryDetailed = mapSummaryToSummaryDetailed(item)

        if (daySummary) {
          acc[dayOfPractice] = {
            ...acc[dayOfPractice],
            detailedSummaries: [...daySummary.detailedSummaries, summaryDetailed],
            summary: {
              swipeCount: daySummary.summary.swipeCount + item.swipeCount,
              guesses: {
                right: daySummary.summary.guesses.right + item.guesses.right,
                wrong: daySummary.summary.guesses.wrong + item.guesses.wrong,
                unanswered: daySummary.summary.guesses.unanswered + item.guesses.unanswered
              }
            }
          }
        } else {
          acc[dayOfPractice] = {
            detailedSummaries: [summaryDetailed],
            summary: {
              swipeCount: item.swipeCount,
              guesses: {
                right: item.guesses.right,
                wrong: item.guesses.wrong,
                unanswered: item.guesses.unanswered
              }
            }
          }
        }
        return acc
      }, {})

    return Object.entries(record).map(([day, summary]) => ({
      day: Number(day),
      summary: summary.summary,
      detailedSummaries: summary.detailedSummaries
    }))
  })

  private practiceComparator(a: PracticeSummary, b: PracticeSummary): number {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  }

  protected scrollToDay(day: number): void {
    const element = document.getElementById(`day-${day}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  getCollectionNameFromId(id: string) {
    return (
      this.ls.activeBank().collections.find((c) => c.id === id)?.name || '( Deleted Collection )'
    )
  }
}
