import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Collection, PracticeActive, PracticeConfig, UserLearnable } from '@shared/types'
import { ModalService } from '../../../services/modal-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  calculateAverageConfidencePercent,
  convertToDayPrecisionUTCDate
} from '../../../utils/genaral-utils'
import { StartPracticeFormConf } from '../forms/start-practice-form/start-practice-form'
import { IconComp } from '../icon-comp/icon-comp'
import { SpacedRepetitionTimeline } from '../spaced-repetition-timeline/spaced-repetition-timeline'

type PracticeConfigQuickAction<T extends PracticeConfig['type']> = {
  type: T
}

type CollectionQuickAction = PracticeConfigQuickAction<'collection'> & {
  collection: Collection
  averageScore: number
  practiceDates: Date[]
}

type AddedOnDayQuickAction = PracticeConfigQuickAction<'added-on-day'> & {
  dayCardsAddedUTC: number
  averageScore: number
  practiceDates: number[]
  learnableIDs: string[]
}

type QuickAction =
  | {
      type: 'continue'
      cardsLeft: number
    }
  | {
      type: 'customize'
    }
  | {
      type: 'worst-cards'
      learnableIDs: string[]
      averageScore: number
    }
  | CollectionQuickAction
  | AddedOnDayQuickAction

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
    const currentPractice = this.ls.activeBank().practice.active
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
    // if no active practice continue, else verify quitting it using modal
    if (action.type === 'continue' || action.type === 'customize') {
      this.router.navigate(['practice'])
      return
    }

    const response = await this.modalService.open<StartPracticeFormConf>('start-practice', {
      activePractice: this.ls.activeBank().practice.active
    })

    if (response.type === 'cancel') return
    const direction = response.value.direction

    // Start new with action config, then redirect
    // Just redirect, when customize or continue selected
    if (action.type === 'collection') {
      this.ls.startPractice({
        type: 'collection',
        collectionId: action.collection.id,
        learnableIDs: action.collection.cardIds,
        direction
      })
    } else if (action.type === 'worst-cards') {
      this.ls.startPractice({
        type: 'custom',
        learnableIDs: action.learnableIDs,
        direction
      })
    } else if (action.type === 'added-on-day') {
      this.ls.startPractice({
        type: 'added-on-day',
        dayCardsAddedUTC: action.dayCardsAddedUTC,
        learnableIDs: action.learnableIDs,
        direction
      })
    }
    this.router.navigate(['practice'])
  }

  private deductActionsFromDateAdded(
    history: PracticeActive[],
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

    return Array.from(dateAddedLearnableMap.entries()).map(([dayCardsAddedUTC, learnables]) => {
      const averageScore = calculateAverageConfidencePercent(learnables)
      const practiceDates = history
        .filter((h) => h.type === 'added-on-day')
        .filter((h) => h.dayCardsAddedUTC === dayCardsAddedUTC)
        .map((h) => h.dayCardsAddedUTC)

      return {
        type: 'added-on-day',
        learnableIDs: learnables.map((l) => l.id),
        dayCardsAddedUTC,
        practiceDates,
        averageScore
      }
    })
  }

  private deductActionsFromCollections(
    history: PracticeActive[],
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
          learnableIDs: worstLearnables.map((l) => l.id),
          averageScore: calculateAverageConfidencePercent(worstLearnables)
        }
      ]
    }
  }
}
