import { DatePipe } from '@angular/common'
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output
} from '@angular/core'
import { PracticeActive } from '@shared/types'
import {
  calcMsDifference,
  convertToDayPrecisionUTCDate as convertToDayPrecisionUnixDate,
  dateComparator,
  isSameDay
} from '../../../utils/genaral-utils'

// Date normalised to day, number of lernables guessed
type PracticeTimelineData = {
  day: number
  guessed: number
  isFirstDayOfWeek: boolean
}

@Component({
  selector: 'app-practice-timeline',
  imports: [DatePipe],
  templateUrl: './practice-timeline.html',
  styleUrl: './practice-timeline.scss',
  host: {
    '[style.--max-guesses]': 'maxGuesses()'
  }
})
export class PracticeTimeline {
  selectDay = output<number>()

  constructor() {
    afterNextRender(() => {
      this.host.scrollTo({ left: this.host.scrollWidth, behavior: 'smooth' })
    })
  }

  private host: HTMLElement = inject(ElementRef).nativeElement

  readonly practiceHistory = input.required<PracticeTimelineData[], PracticeActive[]>({
    transform: (prac) => this.mapToTimeline(prac)
  })

  protected readonly maxGuesses = computed(() =>
    Math.max(...this.practiceHistory().map((d) => d.guessed), 0)
  )

  private mapToTimeline(history: PracticeActive[]): PracticeTimelineData[] {
    const { earliestMonday, latestSunday } = this.getDateRange(history.map((h) => h.createdAt))

    const range = calcMsDifference(earliestMonday, latestSunday)
    const oneDayInMs = 1000 * 60 * 60 * 24

    return Array.from({ length: range + 1 }, (_, i) => i * oneDayInMs + earliestMonday).map(
      (day) => {
        const guessed = history
          .filter((h) => isSameDay(h.createdAt, day))
          .map((h) => h.guessables.filter((g) => g.guess !== 'unanswered').length)
          .reduce((acc, val) => acc + val, 0)

        const isFirstDayOfWeek = new Date(day).getDay() === 1

        return { day, guessed, isFirstDayOfWeek }
      }
    )
  }

  /**
   * Returns Monday of the Week of the first practice, and sunday of the week of last practice
   * Ensure that always at least a full week of days is visible
   */
  private getDateRange(pracitceDates: Date[]): {
    earliestMonday: number
    latestSunday: number
  } {
    const sortedPractices = pracitceDates.sort(dateComparator)
    const earliestDate = new Date(sortedPractices.at(0) || new Date())
    const latesDate = new Date(sortedPractices.at(-1) || new Date())

    earliestDate.setDate(earliestDate.getDate() - ((earliestDate.getDay() + 6) % 7))
    latesDate.setDate(latesDate.getDate() + ((7 - latesDate.getDay()) % 7))

    return {
      earliestMonday: convertToDayPrecisionUnixDate(earliestDate),
      latestSunday: convertToDayPrecisionUnixDate(latesDate)
    }
  }
}
