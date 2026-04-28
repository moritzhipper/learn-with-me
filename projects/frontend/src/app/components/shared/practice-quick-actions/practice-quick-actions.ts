import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Collection, Practice, UserLearnable } from '@shared/types'
import { ModalService } from '../../../services/modal-service'
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
      learnableIds: string[]
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
  private readonly ls = inject(LearnablesStore)
  private readonly modalService = inject(ModalService)
  private readonly router = inject(Router)

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
    quickActions.push(...this.deductWorstCardsAction(cards))

    // link to customize page
    quickActions.push({ type: 'customize' })

    // end: sort all quickactions by relevance. find out which relevance is best lol
    return quickActions
  })

  protected async selectAction(action: QuickAction) {
    // if not continue, but acitve practice -> verify quitting it using modal
    // else start practice with selected ids, then route to ractice page

    if (this.ls.activeBank().practice.current && action.type !== 'continue') {
      const response = await this.modalService.open('confirm', {
        message:
          'You have an ongoing practice session. If you start a new one your progress will be lost.',
        label: 'Thats fine!'
      })
      if (response.type === 'cancel') return
      this.ls.quitPracticePrematurly()
    }

    // start new with action config, (also set correct type for history)
    // Just redirect, when customize or continue selected
    // then redirect
    if (action.type === 'collection') {
      this.ls.startPractice(action.collection.cardIds, 'forward')
    } else if (action.type === 'worst-cards') {
      this.ls.startPractice(action.learnableIds, 'forward')
    } else if (action.type === 'added-by-day') {
      this.ls.startPractice(action.learnableIds, 'forward')
    }
    this.router.navigate(['practice'])
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

  private deductWorstCardsAction(learnables: UserLearnable[]): QuickAction[] {
    // do bad learnable cascade
    // return empty when all learnables better than 80%
    let worstLearnables = learnables.filter((l) => calculateAverageConfidencePercent([l]) < 0.2)
    if (worstLearnables.length === 0) {
      worstLearnables = learnables.filter((l) => calculateAverageConfidencePercent([l]) < 0.6)
    } else if (worstLearnables.length === 0) {
      worstLearnables = learnables.filter((l) => calculateAverageConfidencePercent([l]) < 0.8)
    }

    if (worstLearnables.length === 0) {
      return []
    } else {
      return [
        {
          type: 'worst-cards',
          learnableIds: worstLearnables.map((l) => l.id),
          averageScore: calculateAverageConfidencePercent(worstLearnables)
        }
      ]
    }
  }
}
