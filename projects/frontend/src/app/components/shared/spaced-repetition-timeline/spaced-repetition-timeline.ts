import { Component, input } from '@angular/core'
import { calcDaysAgo } from '../../../utils/genaral-utils'

@Component({
  selector: 'app-spaced-repetition-timeline',
  imports: [],
  templateUrl: './spaced-repetition-timeline.html',
  styleUrl: './spaced-repetition-timeline.scss'
})
export class SpacedRepetitionTimeline {
  readonly dates = input.required<number[], Date[]>({ transform: this.mapToDaysAgo })

  protected readonly SPACED_REP_INTERVALS = [1, 3, 7, 14, 30, 60]

  private mapToDaysAgo(dates: Date[]): number[] {
    const now = new Date()
    return dates.map((d) => calcDaysAgo(now, d))
  }
}
