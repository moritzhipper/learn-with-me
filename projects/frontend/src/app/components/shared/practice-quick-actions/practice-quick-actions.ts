import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Collection, Practice, UserLearnable } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  calculateAverageConfidencePercent,
  convertToDayPrecisionUTCDate
} from '../../../utils/genaral-utils'
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
      dateAddedUTC: number
      learnableIds: string[]
      averageScore: number
      practiceDates: number[]
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
    const history = this.ls.activeBank().practice.history

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
      history,
      this.ls.collections(),
      cards
    )
    quickActions.push(...spacedRepActions)

    // By date added!
    quickActions.push(...this.deductActionsFromDateAdded(history, cards))

    // By worst cards
    // link to customize page
    quickActions.push({ type: 'customize' })

    // end: sort all quickactions by relevance. find out which relevance is best lol
    return quickActions
  })

  protected selectAction(action: QuickAction) {
    // if not continue, but acitve practice -> verify using modal
    // else start practice with selected ids, then route to ractice page
  }

  private deductActionsFromDateAdded(
    history: Practice[],
    learnables: UserLearnable[]
  ): QuickAction[] {
    // Map all learnables to a map by day added
    // then convert map to quickactions

    const dateAddedLearnableMap: Map<number, UserLearnable[]> = new Map()

    learnables.forEach((learnable) => {
      // convert to UTC to allow Map to do its lookup thing
      const dayAddedUtc = convertToDayPrecisionUTCDate(learnable.createdAt)

      if (!dateAddedLearnableMap.has(dayAddedUtc)) {
        dateAddedLearnableMap.set(dayAddedUtc, [learnable])
      } else {
        dateAddedLearnableMap.get(dayAddedUtc)!.push(learnable)
      }
    })

    return Array.from(dateAddedLearnableMap.entries()).map(([dateAddedUTC, learnables]) => {
      const averageScore = calculateAverageConfidencePercent(learnables)
      const practiceDates = history
        .filter((h) => h.type === 'added-on-day')
        .filter((h) => h.dayCardsAddedUTC === dateAddedUTC)
        .map((h) => h.dayCardsAddedUTC)

      return {
        type: 'added-by-day',
        learnableIds: learnables.map((l) => l.id),
        dateAddedUTC,
        practiceDates,
        averageScore
      }
    })
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
