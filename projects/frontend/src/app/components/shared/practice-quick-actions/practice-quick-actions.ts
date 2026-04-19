import { Component, computed, inject } from '@angular/core'
import { Collection, Practice, UserLearnable } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { calculateAverageConfidencePercent } from '../../../utils/genaral-utils'
import { IconComp } from '../icon-comp/icon-comp'

type QuickAction =
  | {
      type: 'continue'
      cardsLeft: number
    }
  | {
      type: 'collection-spaced-rep'
      collection: Collection
      averageScore: number
      daysAgo: number
    }
  | {
      type: 'collection-improve'
      collection: Collection
      averageScore: number
    }
  | {
      type: 'collection-start'
      collection: Collection
      averageScore: number
    }
  | {
      type: 'customize'
    }

type SpacedRepetitionInterval = 1 | 3 | 7 | 14 | 30 | 60

@Component({
  selector: 'app-practice-quick-actions',
  imports: [IconComp],
  templateUrl: './practice-quick-actions.html',
  styleUrl: './practice-quick-actions.scss'
})
export class PracticeQuickActions {
  //   SHow those presets: - 'Continue Ongoing' - 'Pracice by room for improvement', - 'Practice by
  // collecion' - 'Practice newest Cards', - practice 'Spaced repetition review',
  // custom pracitce
  private readonly ls = inject(LearnablesStore)

  protected readonly spacedRepIntervals: SpacedRepetitionInterval[] = [1, 3, 7, 14, 30, 60]

  quickActions = computed<QuickAction[]>(() => {
    const cards = this.ls.activeBank().learnables

    const quickActions: QuickAction[] = []

    // add resume card if necessary
    const currentPractice = this.ls.activeBank().practice.current
    if (currentPractice) {
      const cardsLeft = currentPractice.guessables.length - currentPractice.guessableIndex
      quickActions.push({ type: 'continue', cardsLeft })
    }
    // add review card for spaced repetition based on history
    // spaced repetition times: 1d, 3d, 7d, 14d, 30d, 60d
    const spacedRepActions = this.getSPacedRepetitinActions(
      this.ls.activeBank().practice.history,
      this.ls.collections(),
      cards
    )
    quickActions.concat(spacedRepActions)

    // add practice newest cards

    // add collections here sorted by creation date

    // exclude collections that are already included in review or room for improvement
    const collections = this.ls.collections()
    const learnables = this.ls.learnables()
    for (const collection of collections) {
      const collectionLearnables = learnables.filter((l) => collection.cardIds.includes(l.id))
      const averageScore = calculateAverageConfidencePercent(collectionLearnables)
      quickActions.push({ type: 'collection-start', collection, averageScore })
    }

    // link to customize page
    quickActions.push({ type: 'customize' })

    return quickActions
  })

  private mapToConfidencePercent(ids: string[], learnables: UserLearnable[]): number {
    const colLearnables = learnables.filter((l) => ids.includes(l.id))
    return calculateAverageConfidencePercent(colLearnables)
  }

  protected selectAction(action: QuickAction) {
    // if not continue, but acitve practice -> verify using modal
    // else start practice with selected ids, then route to ractice page
  }

  private getSPacedRepetitinActions(
    history: Practice[],
    collections: Collection[],
    learnables: UserLearnable[]
  ): QuickAction[] {
    const now = new Date()
    const getDaysAgo = (practice: Practice) =>
      (now.getTime() - new Date(practice.createdAt).getTime()) / (1000 * 60 * 60 * 24)

    return history.reduce((actions: QuickAction[], practice) => {
      const daysAgo = getDaysAgo(practice)
      const maximumIntervalDistance = 3

      const hasRelevantInterval = this.spacedRepIntervals.some(
        (interval) => interval <= daysAgo && daysAgo < interval + maximumIntervalDistance
      )

      if (practice.type !== 'collection' || !hasRelevantInterval) return actions
      const relevantCollection = collections.find((c) => c.id === practice.collectionId)

      if (!relevantCollection) return actions
      const averageScore = this.mapToConfidencePercent(relevantCollection.cardIds, learnables)

      return [
        ...actions,
        {
          type: 'collection-spaced-rep',
          collection: relevantCollection,
          averageScore,
          daysAgo
        }
      ]
    }, [])
  }
}
