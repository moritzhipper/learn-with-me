import { Component, computed, inject } from '@angular/core'
import { Collection, UserLearnable } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { calculateAverageConfidencePercent } from '../../../utils/genaral-utils'

type QuickAction =
  | {
      type: 'continue'
      cardsLeft: number
    }
  | {
      type: 'collection-review'
      collection: Collection
      cardsCount: number
      averageScore: number
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

@Component({
  selector: 'app-practice-quick-actions',
  imports: [],
  templateUrl: './practice-quick-actions.html',
  styleUrl: './practice-quick-actions.scss'
})
export class PracticeQuickActions {
  //   SHow those presets: - 'Continue Ongoing' - 'Pracice by room for improvement', - 'Practice by
  // collecion' - 'Practice newest Cards', - practice 'Spaced repetition review',
  private readonly ls = inject(LearnablesStore)

  quickActions = computed<QuickAction[]>(() => {
    const quickActions: QuickAction[] = []

    // add resume card if necessary
    const currentPractice = this.ls.currentPractice()
    if (currentPractice) {
      const cardsLeft = currentPractice.guessables.length - currentPractice.index
      quickActions.push({ type: 'continue', cardsLeft })
    }
    // add review card for spaced repetition based on history

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
}
