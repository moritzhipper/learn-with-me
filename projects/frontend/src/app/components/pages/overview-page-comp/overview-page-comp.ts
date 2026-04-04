import { Component, computed, inject, linkedSignal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CollectionUser } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  calculateAverageConfidencePercent,
  removeDuplicates,
  staggerDelays
} from '../../../utils/genaral-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { Bubble } from '../../shared/bubbles/bubble/bubble'
import { Bubbles } from '../../shared/bubbles/bubbles'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { PagePlaceholderComp } from '../../shared/page-placeholder-comp/page-placeholder-comp'
import { CollectionInfoComp } from './collection-info-comp/collection-info-comp'
import { FilterAction, FilterComp } from './filter-comp/filter-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'
import { OverviewPageFacade } from './overview-page-facade'

/**
 * Overview page component.
 * Manages all UI state and delegates business logic to the facade service.
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview-page-comp.html',
  styleUrl: './overview-page-comp.scss',
  imports: [
    CollectionInfoComp,
    ReactiveFormsModule,
    LearnableComp,
    IconComp,
    FormsModule,
    PageHeaderComp,
    PageIconComp,
    FilterComp,
    PagePlaceholderComp,
    Bubbles,
    Bubble
  ],
  host: { class: 'page mid' }
})
export class OverviewComp {
  private readonly _lStore = inject(LearnablesStore)
  private readonly _facade = inject(OverviewPageFacade)

  // Component state management
  protected readonly bank = this._lStore.activeBank
  readonly collections = computed(() => this.bank().collections)
  readonly learnables = computed(() => this.bank().learnables)

  protected readonly animdelays = staggerDelays(5)

  readonly selectedCollectionId = linkedSignal<CollectionUser[], string | null>({
    source: this.collections,
    computation: (collections, previous) => {
      const previousId = previous?.value
      if (!previousId) return null
      const stillExists = collections.some((c) => c.id === previousId)
      return stillExists ? previousId : null
    }
  })

  readonly selectedCollection = computed<CollectionUser | null>(
    () => this.collections().find((c) => c.id === this.selectedCollectionId()) ?? null
  )

  // resets selectedLearnableSelection when selected collectionID changes
  readonly selectedLearnableIds = linkedSignal<CollectionUser | null, string[]>({
    source: this.selectedCollection,
    computation: () => []
  })

  readonly unsortedCards = computed(() => {
    const allCollectionCardIds = new Set(this.collections().flatMap((c) => c.cardIds))
    return this.learnables().filter((l) => !allCollectionCardIds.has(l.id))
  })

  private readonly _newestIds = computed(() =>
    filterLearnables(this.learnables(), { age: 'newest' }).map((l) => l.id)
  )

  private readonly _collectionLearnables = computed(() => {
    const collection = this.selectedCollection()
    if (!collection) return this.learnables()

    return this.learnables().filter((l) => collection.cardIds.includes(l.id))
  })

  readonly visibleLearnables = computed(() =>
    filterLearnables(this._collectionLearnables(), { orderBy: 'created' })
  )

  readonly headerConfig = computed(() => {
    const coll = this.selectedCollection()

    if (coll) {
      return {
        header: coll.name,
        cardCount: this._collectionLearnables().length,
        averageConfidence: calculateAverageConfidencePercent(this._collectionLearnables()),
        date: 'created' in coll ? coll.createdAt : undefined
      }
    }
    return {
      header: 'All Cards',
      cardCount: this.learnables().length,
      averageConfidence: calculateAverageConfidencePercent(this.learnables())
    }
  })

  async handleFilterAction(action: FilterAction) {
    const collection = this.selectedCollection()
    if (!collection) return

    if (action === 'edit') {
      await this._facade.openRenameCollectionModal(collection)
    } else if (action === 'share') {
      await this._facade.openShareCollectionModal(this.bank(), collection.id)
    } else if (action === 'download') {
      this._facade.downloadCollection(collection.id)
    } else if (action === 'delete') {
      await this._facade.openDeleteCollectionModal(collection)
    }
  }

  readonly collectionIsEmpty = computed(() => this._collectionLearnables().length === 0)

  readonly userHasCards = computed(() => this._lStore.learnables().length !== 0)

  // View event handlers - delegate to facade

  async bulkEdit() {
    const cardsAdded = await this._facade.openBulkEditModal(
      this.selectedLearnableIds(),
      this.selectedCollection()
    )
    this.selectNewestIfAdded(cardsAdded)
  }

  private selectNewestIfAdded(cardsAdded: boolean) {
    if (cardsAdded) this.selectNewest()
  }

  addVisibleToSelection() {
    const visibleLearnableIDs = this.visibleLearnables().map((l) => l.id)

    const newSelectionIDs = removeDuplicates([
      ...visibleLearnableIDs,
      ...this.selectedLearnableIds()
    ])

    this.selectedLearnableIds.set(newSelectionIDs)
  }

  resetLearnableSelection() {
    this.selectedLearnableIds.set([])
  }

  toggleLearnableSelection(lId: string) {
    if (this.selectedLearnableIds().includes(lId)) {
      this.selectedLearnableIds.update((s) => s.filter((id) => id !== lId))
    } else {
      this.selectedLearnableIds.update((s) => [...s, lId])
    }
  }

  isSelected(lId: string): boolean {
    return this.selectedLearnableIds().includes(lId)
  }

  isLastAdded(lId: string): boolean {
    return this._newestIds().includes(lId)
  }

  selectNewest() {
    this.selectedLearnableIds.set(this._newestIds())
  }

  async addToCollection() {
    await this._facade.openAddToCollectionModal(this.selectedLearnableIds())
    this.selectedLearnableIds.set([])
  }

  async removeSelectionFromCollection() {
    const collectionId = this.selectedCollection()?.id
    if (!collectionId) return

    this._facade.removeLearnablesFromCollection(collectionId, this.selectedLearnableIds())
    this.selectedLearnableIds.set([])
  }

  async deleteSelection() {
    await this._facade.confirmAndDeleteLearnables(this.selectedLearnableIds())
    this.selectedLearnableIds.set([])
  }
}
