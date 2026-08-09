import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Collection, PracticeActive, PracticeConfig, UserLearnable } from '@shared/types'
import { ModalService } from '../../../services/modal-service'
import { LearnablesStore } from '../../../store/learnables-store'
import {
  aggregateConfidence,
  ConfidenceAggregate,
  convertToDayPrecisionUTCDate
} from '../../../utils/genaral-utils'
import { ConfidenceStats } from '../confidence/confidence-stats/confidence-stats'
import {
  StartPracticeFormConfig,
  StartPracticeFormResult
} from '../forms/start-practice-form/start-practice-form'
import { IconComp } from '../icon-comp/icon-comp'
import { SpacedRepetitionTimeline } from '../spaced-repetition-timeline/spaced-repetition-timeline'

type PracticeConfigQuickAction<T extends PracticeConfig['type']> = {
  type: T
}

type CollectionQuickAction = PracticeConfigQuickAction<'collection'> & {
  collection: Collection
  averageScore: ConfidenceAggregate
  practiceDates: Date[]
}

type AddedOnDayQuickAction = PracticeConfigQuickAction<'added-on-day'> & {
  dayCardsAddedUTC: number
  averageScore: ConfidenceAggregate
  practiceDates: number[]
  learnableIDs: string[]
}

type WorstCardsQuickAction = {
  type: 'worst-cards'
  learnableIDs: string[]
  averageScore: ConfidenceAggregate
}

type ContinueQuickAction = {
  type: 'continue'
  cardsLeft: number
}

type QuickAction =
  | {
      type: 'customize'
    }
  | ContinueQuickAction
  | WorstCardsQuickAction
  | CollectionQuickAction
  | AddedOnDayQuickAction

@Component({
  selector: 'app-practice-quick-actions',
  imports: [IconComp, DatePipe, SpacedRepetitionTimeline, ConfidenceStats],
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
    const hasActivePractice = !!this.ls.activeBank().practice.active

    // if no active practice continue, else verify quitting it using modal
    if (action.type === 'continue' || (action.type === 'customize' && !hasActivePractice)) {
      this.router.navigate(['practice'])
      return
    }

    const confidence = this.getConfidenceFromQuickAction(action, this.ls.activeBank().learnables)

    const modalConfig: StartPracticeFormConfig = {
      confidence,
      languageConfig: this.ls.activeBank().language,
      hasActivePractice
    }

    const resetAndDirectionConfirmChoice = await this.modalService.open<StartPracticeFormResult>(
      'start-practice',
      {
        config: modalConfig
      }
    )

    if (resetAndDirectionConfirmChoice.type === 'cancel') return

    if (hasActivePractice) {
      this.ls.resetPracticeAndSaveToHistory()
    }

    const guessableField = resetAndDirectionConfirmChoice.value.guessableField

    // Start new with action config, then redirect
    // Just redirect, when customize or continue selected
    if (action.type === 'collection') {
      this.ls.startPractice({
        type: 'collection',
        collectionId: action.collection.id,
        learnableIDs: action.collection.cardIds,
        guessableField: guessableField
      })
    } else if (action.type === 'worst-cards') {
      this.ls.startPractice({
        type: 'custom',
        learnableIDs: action.learnableIDs,
        guessableField: guessableField
      })
    } else if (action.type === 'added-on-day') {
      this.ls.startPractice({
        type: 'added-on-day',
        dayCardsAddedUTC: action.dayCardsAddedUTC,
        learnableIDs: action.learnableIDs,
        guessableField: guessableField
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

    return Array.from(dateAddedLearnableMap.entries())
      .map<AddedOnDayQuickAction>(([dayCardsAddedUTC, learnables]) => {
        const averageScore = aggregateConfidence(learnables)
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
      .filter((action) => action.learnableIDs.length > 10)
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

      const averageScore = aggregateConfidence(
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
    let worstLearnables = learnables.filter((l) => aggregateConfidence([l]).all < 0.2)
    if (worstLearnables.length === 0) {
      worstLearnables = learnables.filter((l) => aggregateConfidence([l]).all < 0.6)
    } else if (worstLearnables.length === 0) {
      worstLearnables = learnables.filter((l) => aggregateConfidence([l]).all < 0.8)
    }

    if (worstLearnables.length === 0) return []

    return [
      {
        type: 'worst-cards',
        learnableIDs: worstLearnables.map((l) => l.id),
        averageScore: aggregateConfidence(worstLearnables)
      }
    ]
  }

  private getConfidenceFromQuickAction(
    action: QuickAction,
    learnables: UserLearnable[]
  ): ConfidenceAggregate | undefined {
    if (action.type === 'customize' || action.type === 'continue') return undefined
    const ids = action.type === 'collection' ? action.collection.cardIds : action.learnableIDs
    return aggregateConfidence(learnables.filter((l) => ids.includes(l.id)))
  }
}
