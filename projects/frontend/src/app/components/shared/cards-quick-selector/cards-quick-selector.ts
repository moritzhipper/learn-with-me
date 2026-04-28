import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Collection } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { calculateAverageConfidencePercent } from '../../../utils/genaral-utils'

type AllCardsSummary = {
  allCardsCount: number
  collectionCount: number
  averageConfidence: number
}

type CollectionSummary = {
  collection: Collection
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

  protected summary = computed<AllCardsSummary>(() => {
    const allCards = this.ls.learnables()
    const averageConfidence = calculateAverageConfidencePercent(allCards)
    return {
      allCardsCount: allCards.length,
      collectionCount: this.collections().length,
      averageConfidence
    }
  })

  protected collectionSummary = computed<CollectionSummary[]>(() => {
    const allCards = this.ls.learnables()
    return this.collections().map((coll) => ({
      collection: coll,
      averageConfidence: calculateAverageConfidencePercent(
        allCards.filter((card) => coll.cardIds.includes(card.id))
      )
    }))
  })
}
