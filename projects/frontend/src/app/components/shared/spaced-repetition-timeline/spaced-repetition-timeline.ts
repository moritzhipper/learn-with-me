import { Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { completedTimelineIcon, pendingTimelineIcon } from '../../../icon-registry'
import { calcMsDifference } from '../../../utils/genaral-utils'

type TimeMarker = {
  intervall: number
  type: 'practice' | 'now'
}

@Component({
  selector: 'app-spaced-repetition-timeline',
  imports: [NgIcon],
  templateUrl: './spaced-repetition-timeline.html',
  styleUrl: './spaced-repetition-timeline.scss'
})
export class SpacedRepetitionTimeline {
  protected readonly icons = {
    completedTimelineIcon,
    pendingTimelineIcon
  }
  readonly dates = input.required<TimeMarker[], Date[] | number[]>({ transform: this.mapToMarkers })

  protected readonly SPACED_REP_INTERVALS = [1, 3, 7, 14, 30, 60]

  /**
   * Maps practice dates onto a relative spaced-repetition timeline.
   *
   * The earliest practice date is treated as interval `1`. Each later practice
   * is then positioned relative to that first practice, while a trailing `now`
   * marker is added so the UI can render the current point in time.
   */
  private mapToMarkers(dates: Date[] | number[]): TimeMarker[] {
    if (dates.length === 0) return [{ intervall: 1, type: 'now' }]

    const now = new Date()
    const daysAgo = dates.map((date) => calcMsDifference(date, now))

    // This is days ago +1 for intervall index shift
    const nowInterval = Math.max(...daysAgo) + 1

    const markers: TimeMarker[] = daysAgo.map((v) => ({
      intervall: nowInterval - v,
      type: 'practice'
    }))

    const nowMarker: TimeMarker = { intervall: nowInterval, type: 'now' }

    return [...markers, nowMarker]
  }
}
