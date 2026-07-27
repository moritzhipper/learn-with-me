import { Component, computed, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Collection } from '@shared/types'
import { LearnablesStore } from '../../../store/learnables-store'
import { aggregateConfidence, ConfidenceAggregate } from '../../../utils/genaral-utils'
import { UserCollection } from '../../shared/banks-and-collections/user-collection/user-collection'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageWrapper } from '../page-wrapper/page-wrapper'

type CollectionWithConfidence = {
  collection: Collection
  confidence: ConfidenceAggregate
}

@Component({
  selector: 'liz-cards-page',
  imports: [PageWrapper, PageHeaderComp, UserCollection, RouterLink],
  templateUrl: './cards-page.html',
  styleUrl: './cards-page.scss'
})
export class CardsPage {
  private readonly ls = inject(LearnablesStore)

  collectionsWithConfidence = computed<CollectionWithConfidence[]>(() => {
    const collections = this.ls.collections()
    const allCards = this.ls.learnables()

    return collections.map((collection) => {
      const cardsInCollection = allCards.filter((card) => collection.cardIds.includes(card.id))
      const confidence = aggregateConfidence(cardsInCollection)
      return { collection, confidence }
    })
  })
}
