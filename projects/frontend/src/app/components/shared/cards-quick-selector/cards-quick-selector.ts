import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Collection } from '@shared/types'
import { LearnablesStore } from '../../../store/learnables-store'
import { calculateAverageConfidencePercent } from '../../../utils/genaral-utils'

type AllCardsSummary = {
  type: 'all'
  allCardsCount: number
  collectionCount: number
  averageConfidence: number
  collectionLess: number
}

type CollectionSummary = Collection & {
  type: 'collection'
  averageConfidence: number
}

@Component({
  selector: 'app-cards-quick-selector',
  imports: [DatePipe],
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
      ).all
    }))

    const collectionIds = collections.flatMap((c) => c.cardIds)
    const collectionLessCards = allCards.filter((c) => !collectionIds.includes(c.id))

    const allCardsSummary: AllCardsSummary = {
      type: 'all',
      allCardsCount: allCards.length,
      collectionCount: collections.length,
      averageConfidence: calculateAverageConfidencePercent(allCards).all,
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
