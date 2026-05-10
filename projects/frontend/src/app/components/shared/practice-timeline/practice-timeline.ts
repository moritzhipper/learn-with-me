import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { PracticeActive } from '@shared/types'
import {
  calcDaysDifference,
  convertToDayPrecisionUTCDate,
  isSameDay
} from '../../../utils/genaral-utils'

// Date normalised to day, number of lernables guessed
type PracticeTimelineData = {
  day: number
  guessed: number
}

@Component({
  selector: 'app-practice-timeline',
  imports: [DatePipe],
  templateUrl: './practice-timeline.html',
  styleUrl: './practice-timeline.scss'
})
export class PracticeTimeline {
  practiceHistory = input.required<PracticeTimelineData[], PracticeActive[]>({
    transform: this.mapToTimeline
  })

  private mapToTimeline(history: PracticeActive[]): PracticeTimelineData[] {
    const earliestDate = Math.min(...history.map((h) => convertToDayPrecisionUTCDate(h.createdAt)))
    const range = calcDaysDifference(new Date(), earliestDate)
    const oneDayInMs = 1000 * 60 * 60 * 24

    return Array.from({ length: range + 1 }, (_, i) => i * oneDayInMs + earliestDate).map((day) => {
      const guessed = history
        .filter((h) => isSameDay(h.createdAt, day))
        .map((h) => h.guessables.filter((g) => g.guess !== 'unanswered').length)
        .reduce((acc, val) => acc + val, 0)

      return { day, guessed }
    })
  }
}
