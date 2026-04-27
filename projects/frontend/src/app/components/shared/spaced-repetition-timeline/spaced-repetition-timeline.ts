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
   * Mapping steps:
   * 1. Convert all practice dates to their `daysAgo` distance from now.
   * 2. Use the maximum `daysAgo` value as the first practice date.
   * 3. Shift each practice marker by `+1` so the first practice lands on
   *    interval `1` instead of `0`.
   *
   * @param dates Practice dates as `Date` objects or timestamps.
   * @returns Timeline markers for each practice plus a final `now` marker.
   */
  private mapToMarkers(dates: Date[] | number[]): TimeMarker[] {
    if (dates.length === 0) return []

    // get max days ago
    const now = new Date()
    const allDaysAgo = dates.map((d) => calcDaysAgo(now, d))
    const maxDaysAgo = Math.max(...allDaysAgo)

    // map to maxDaysAgo - daysAgo
    const markers: TimeMarker[] = allDaysAgo.map((daysAgo) => ({
      intervall: maxDaysAgo - daysAgo + 1,
      type: 'practice'
    }))

    const nowMarker: TimeMarker = { intervall: maxDaysAgo + 1, type: 'now' }

    return [...markers, nowMarker]
  }
}
