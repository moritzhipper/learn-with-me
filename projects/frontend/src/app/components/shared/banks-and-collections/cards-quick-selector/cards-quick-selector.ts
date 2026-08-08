import { Component, computed, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Collection } from '@shared/types'
import { LearnablesStore } from '../../../../store/learnables-store'
import { aggregateConfidence, ConfidenceAggregate } from '../../../../utils/genaral-utils'
import { ConfidenceStats } from '../../confidence/confidence-stats/confidence-stats'
import { CardsStack } from '../cards-stack/cards-stack'
import { UserCollection } from '../user-collection/user-collection'

type CollectionWithConfidence = {
  collection: Collection
  confidence: ConfidenceAggregate
}

@Component({
  selector: 'app-cards-quick-selector',
  imports: [ConfidenceStats, UserCollection, RouterLink, CardsStack],
  templateUrl: './cards-quick-selector.html',
  styleUrls: ['./cards-quick-selector.scss']
})
export class CardsQuickSelector {
  private readonly ls = inject(LearnablesStore)

  protected collectionsWithConfidence = computed<CollectionWithConfidence[]>(() => {
    const collections = this.ls.collections()
    const allCards = this.ls.learnables()

    return collections.map((collection) => {
      const cardsInCollection = allCards.filter((card) => collection.cardIds.includes(card.id))
      const confidence = aggregateConfidence(cardsInCollection)
      return { collection, confidence }
    })
  })

  protected allCardsWithConfidence = computed(() => {
    const confidence = aggregateConfidence(this.ls.learnables())
    const collectionLessCount = this.ls
      .learnables()
      .filter(
        (card) => !this.ls.collections().some((collection) => collection.cardIds.includes(card.id))
      ).length

    return {
      confidence,
      collectionLessCount
    }
  })
}
