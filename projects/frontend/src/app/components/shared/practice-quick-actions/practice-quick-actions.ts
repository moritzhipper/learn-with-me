import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Collection, Practice, UserLearnable } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { calculateAverageConfidencePercent } from '../../../utils/genaral-utils'
import { IconComp } from '../icon-comp/icon-comp'
import { SpacedRepetitionTimeline } from '../spaced-repetition-timeline/spaced-repetition-timeline'

type QuickAction =
  | {
      type: 'continue'
      cardsLeft: number
    }
  | {
      type: 'collection'
      collection: Collection
      averageScore: number
      practiceDates: Date[]
    }
  | {
      type: 'worst-cards'
      collection: Collection
      averageScore: number
    }
  | {
      type: 'added-by-day'
      date: Date
      learnableIds: string[]
      averageScore: number
    }
  | {
      type: 'customize'
    }

@Component({
  selector: 'app-practice-quick-actions',
  imports: [IconComp, DatePipe, SpacedRepetitionTimeline],
  templateUrl: './practice-quick-actions.html',
  styleUrl: './practice-quick-actions.scss'
})
export class PracticeQuickActions {
  //  SHow those presets: - 'Continue Ongoing' - 'Pracice by room for improvement', - 'Practice by
  // collecion' - 'Practice newest Cards', - practice 'Spaced repetition review',
  // custom pracitce
  private readonly ls = inject(LearnablesStore)

  // also add: worst cards quick action?
  quickActions = computed<QuickAction[]>(() => {
    const cards = this.ls.activeBank().learnables

    const quickActions: QuickAction[] = []

    // add resume card if necessary
    const currentPractice = this.ls.activeBank().practice.current
    if (currentPractice) {
      const cardsLeft = currentPractice.guessables.length - currentPractice.guessableIndex
      quickActions.push({ type: 'continue', cardsLeft })
    }

    // Map collections to practice intervalls
    // spaced repetition times: 1d, 3d, 7d, 14d, 30d, 60d
    const spacedRepActions = this.deductActionsFromCollections(
      this.ls.activeBank().practice.history,
      this.ls.collections(),
      cards
    )
    quickActions.push(...spacedRepActions)

    // By date added!
    quickActions.push(...this.deductActionsFromDateAdded(cards))

    // link to customize page
    quickActions.push({ type: 'customize' })

    // end: sort all quickactions by relevance. find out which relevance is best lol
    return quickActions
  })

  protected selectAction(action: QuickAction) {
    // if not continue, but acitve practice -> verify using modal
    // else start practice with selected ids, then route to ractice page
  }

  private deductActionsFromDateAdded(learnables: UserLearnable[]): QuickAction[] {
    const dateLearnableMap: Map<Date, UserLearnable[]> = new Map()

    learnables.forEach((learnable) => {
      // todo: put every date to start of day to group by day correctly and allow sort of array
      const dateStartOfDay = new Date(learnable.createdAt)
      dateStartOfDay.setHours(0, 0, 0, 0)

      if (!dateLearnableMap.has(dateStartOfDay)) {
        dateLearnableMap.set(dateStartOfDay, [learnable])
      } else {
        dateLearnableMap.get(dateStartOfDay)!.push(learnable)
      }
    })

    return Array.from(dateLearnableMap.entries()).map(([date, learnables]) => ({
      type: 'added-by-day',
      date,
      learnableIds: learnables.map((l) => l.id),
      averageScore: calculateAverageConfidencePercent(learnables)
    }))
  }

  private deductActionsFromCollections(
    history: Practice[],
    collections: Collection[],
    learnables: UserLearnable[]
  ): QuickAction[] {
    const now = new Date()

    return collections.map((collection) => {
      const practiceDates = history
        .filter((h) => h.type === 'collection')
        .filter((h) => h.collectionId === collection.id)
        .map((h) => h.createdAt)

      const averageScore = calculateAverageConfidencePercent(
        learnables.filter((l) => collection.cardIds.includes(l.id))
      )

      return {
        type: 'collection',
        collection,
        practiceDates,
        averageScore
      }
    })
  }
}
