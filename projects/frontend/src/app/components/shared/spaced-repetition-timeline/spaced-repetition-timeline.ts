import { Component, input } from '@angular/core'
import { calcDaysAgo } from '../../../utils/genaral-utils'

type TimeMarker = {
  intervall: number
  type: 'practice' | 'now'
}

@Component({
  selector: 'app-spaced-repetition-timeline',
  imports: [],
  templateUrl: './spaced-repetition-timeline.html',
  styleUrl: './spaced-repetition-timeline.scss'
})
export class SpacedRepetitionTimeline {
  readonly dates = input.required<TimeMarker[], Date[] | number[]>({ transform: this.mapToMarkers })

  protected readonly SPACED_REP_INTERVALS = [1, 3, 7, 14, 30, 60]

  /**
   * Maps practice dates onto a relative spaced-repetition timeline.
   *
   * The earliest practice date is treated as interval `1`. Each later practice
   * is then positioned relative to that first practice, while a trailing `now`
   * marker is added so the UI can render the current point in time.
   *
   * @param dates Practice dates as `Date` objects or timestamps.
   * @returns Timeline markers for each practice plus a final `now` marker.
   */
  private mapToMarkers(dates: Date[] | number[]): TimeMarker[] {
    if (dates.length === 0) return []

    const now = new Date()
    const daysAgo = dates.map((date) => calcDaysAgo(now, date))
    const nowInterval = Math.max(...daysAgo) + 1

    const markers: TimeMarker[] = daysAgo.map((v) => ({
      intervall: nowInterval - v,
      type: 'practice'
    }))

    const nowMarker: TimeMarker = { intervall: nowInterval, type: 'now' }

    return [...markers, nowMarker]
  }
}
