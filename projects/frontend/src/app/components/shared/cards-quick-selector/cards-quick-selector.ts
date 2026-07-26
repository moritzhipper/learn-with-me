import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Collection } from '@shared/types'
import { LearnablesStore } from '../../../store/learnables-store'
import {
  calculateAverageConfidencePercent,
  ConfidenceAggregate
} from '../../../utils/genaral-utils'
import { UserCollection } from '../banks-and-collections/user-collection/user-collection'
import { ConfidenceStats } from '../confidence/confidence-stats/confidence-stats'

type AllCardsSummary = {
  type: 'all'
  allCardsCount: number
  collectionCount: number
  averageConfidence: ConfidenceAggregate
  collectionLess: number
}

type CollectionSummary = Collection & {
  type: 'collection'
  averageConfidence: ConfidenceAggregate
}

@Component({
  selector: 'app-cards-quick-selector',
  imports: [DatePipe, ConfidenceStats, UserCollection],
  templateUrl: './cards-quick-selector.html',
  styleUrl: './cards-quick-selector.scss'
})
export class CardsQuickSelector {
  private readonly ls = inject(LearnablesStore)

  protected readonly collections = this.ls.collections
  private readonly router = inject(Router)

  protected readonly summaries = computed<(CollectionSummary | AllCardsSummary)[]>(() => {
    const allCards = this.ls.learnables()
    const collections = this.collections()

    const collectionSummaries: CollectionSummary[] = collections.map((coll) => ({
      ...coll,
      type: 'collection',
      averageConfidence: calculateAverageConfidencePercent(
        allCards.filter((card) => coll.cardIds.includes(card.id))
      )
    }))

    const collectionIds = collections.flatMap((c) => c.cardIds)
    const collectionLessCards = allCards.filter((c) => !collectionIds.includes(c.id))

    const allCardsSummary: AllCardsSummary = {
      type: 'all',
      allCardsCount: allCards.length,
      collectionCount: collections.length,
      averageConfidence: calculateAverageConfidencePercent(allCards),
      collectionLess: collectionLessCards.length
    }

    return [...collectionSummaries, allCardsSummary]
  })

  openLink(collectionID?: string) {
    if (collectionID) {
      this.router.navigate(['/cards'], { state: { collectionID } })
    } else {
      this.router.navigate(['/cards'])
    }
  }
}
