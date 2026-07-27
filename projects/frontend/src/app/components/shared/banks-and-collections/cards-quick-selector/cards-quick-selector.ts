import { Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Collection } from '@shared/types'
import { LearnablesStore } from '../../../../store/learnables-store'
import { aggregateConfidence, ConfidenceAggregate } from '../../../../utils/genaral-utils'
import { ConfidenceStats } from '../../confidence/confidence-stats/confidence-stats'
import { UserCollection } from '../user-collection/user-collection'

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
  imports: [ConfidenceStats, UserCollection],
  templateUrl: './cards-quick-selector.html',
  styleUrls: ['./cards-quick-selector.scss', '../banks-and-collections.scss']
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
      averageConfidence: aggregateConfidence(
        allCards.filter((card) => coll.cardIds.includes(card.id))
      )
    }))

    const collectionIds = collections.flatMap((c) => c.cardIds)
    const collectionLessCards = allCards.filter((c) => !collectionIds.includes(c.id))

    const allCardsSummary: AllCardsSummary = {
      type: 'all',
      allCardsCount: allCards.length,
      collectionCount: collections.length,
      averageConfidence: aggregateConfidence(allCards),
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
