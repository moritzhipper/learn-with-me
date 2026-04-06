import { Component, computed, inject } from '@angular/core'
import { LearnablesStore } from '../../../store/learnablesStore'
import { removeDuplicates } from '../../../utils/genaral-utils'
import { SharedBankComp } from '../../pages/share-page-comp/shared-collection-comp/shared-bank-comp'
import { CollectionCardComp } from '../collection-card-comp/collection-card-comp'

type AllCardsSummary = {
  allCardsCount: number
  unsortedCount: number
  collectionCount: number
}

@Component({
  selector: 'app-cards-quick-selector',
  imports: [CollectionCardComp, SharedBankComp],
  templateUrl: './cards-quick-selector.html',
  styleUrl: './cards-quick-selector.scss'
})
export class CardsQuickSelector {
  private readonly ls = inject(LearnablesStore)
  protected readonly collections = this.ls.collections

  protected summary = computed<AllCardsSummary>(() => {
    const collections = this.collections()
    const allIds = removeDuplicates(this.ls.learnables().map((l) => l.id))
    const idsInCollection = removeDuplicates(collections.flatMap((c) => c.cardIds))
    const unsortedCount = allIds.filter((id) => !idsInCollection.includes(id))

    return {
      allCardsCount: allIds.length,
      unsortedCount: unsortedCount.length,
      collectionCount: collections.length
    }
  })
}
