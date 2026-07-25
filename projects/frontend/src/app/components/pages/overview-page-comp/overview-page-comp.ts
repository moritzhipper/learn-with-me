import { Component, computed, inject, linkedSignal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { Collection } from '@shared/types'
import { ModalService } from '../../../services/modal-service'
import { ShareBanksService } from '../../../services/share-banks-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnables-store'
import {
  calculateAverageConfidencePercent,
  ConfidenceAggregate
} from '../../../utils/genaral-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { Bubble } from '../../shared/bubbles/bubble/bubble'
import { Bubbles } from '../../shared/bubbles/bubbles'
import { ConfidenceStats } from '../../shared/confidence/confidence-stats/confidence-stats'
import { ConfirmationType } from '../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { ConfirmCollectionDeletionType } from '../../shared/forms/delete-collection-comp/delete-collection-comp'
import { InfoCard } from '../../shared/info-card/info-card'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { QuickLinks } from '../dashboard-page/quick-links/quick-links'
import { PageWrapper } from '../page-wrapper/page-wrapper'
import { FilterAction, FilterComp } from './filter-comp/filter-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'

/**
 * Overview page component.
 * Manages all UI state and delegates business logic to the facade service.
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview-page-comp.html',
  styleUrl: './overview-page-comp.scss',
  imports: [
    ReactiveFormsModule,
    LearnableComp,
    FormsModule,
    PageHeaderComp,
    FilterComp,
    Bubbles,
    Bubble,
    PageWrapper,
    InfoCard,
    QuickLinks,
    ConfidenceStats
  ]
})
export class OverviewComp {
  private readonly ls = inject(LearnablesStore)
  private readonly toastService = inject(ToastService)
  private readonly modalService = inject(ModalService)
  private readonly shareBanksS = inject(ShareBanksService)
  private readonly router = inject(Router)

  constructor() {
    const collectionIDfromRouter = this.router.currentNavigation()?.extras.state?.['collectionID']
    const isValid =
      typeof collectionIDfromRouter === 'string' &&
      this.collections().some((c) => c.id === collectionIDfromRouter)
    if (isValid) this.selectedCollectionId.set(collectionIDfromRouter)
  }

  // Component state management
  protected readonly bank = this.ls.activeBank
  readonly collections = computed(() => this.bank().collections)
  readonly learnables = computed(() => this.bank().learnables)

  readonly selectedCollectionId = linkedSignal<Collection[], string | null>({
    source: this.collections,
    computation: (collections, previous) => {
      const previousId = previous?.value
      if (!previousId) return null
      const stillExists = collections.some((c) => c.id === previousId)
      return stillExists ? previousId : null
    }
  })

  readonly collectionIsEmpty = computed(() => this._collectionLearnables().length === 0)
  readonly userHasCards = computed(() => this.ls.learnables().length !== 0)

  readonly selectedCollection = computed<Collection | null>(
    () => this.collections().find((c) => c.id === this.selectedCollectionId()) ?? null
  )

  // resets selectedLearnableSelection when selected collectionID changes
  readonly selectedLearnableIds = linkedSignal<Collection | null, string[]>({
    source: this.selectedCollection,
    computation: () => []
  })

  readonly unsortedCards = computed(() => {
    const allCollectionCardIds = new Set(this.collections().flatMap((c) => c.cardIds))
    return this.learnables().filter((l) => !allCollectionCardIds.has(l.id))
  })

  private readonly _collectionLearnables = computed(() => {
    const collection = this.selectedCollection()
    if (!collection) return this.learnables()

    return this.learnables().filter((l) => collection.cardIds.includes(l.id))
  })

  readonly visibleLearnables = computed(() =>
    filterLearnables(this._collectionLearnables(), { orderBy: 'created' })
  )

  readonly confidenceAgg = computed<ConfidenceAggregate>(() =>
    calculateAverageConfidencePercent(this._collectionLearnables())
  )

  async handleFilterAction(action: FilterAction) {
    const collection = this.selectedCollection()
    if (!collection) return

    if (action === 'edit') {
      await this.renameCollection(collection)
    } else if (action === 'share') {
      await this.shareBanksS.shareBank(this.bank(), [collection.id])
    } else if (action === 'download') {
      this.shareBanksS.exportBank(this.ls.activeBank(), { onlyForCollectionIds: [collection.id] })
    } else if (action === 'delete') {
      await this.deleteCollection(collection)
    }
  }

  async bulkEdit() {
    const learnableIDs = this.selectedLearnableIds()
    const learnables = this.ls.learnables().filter((l) => learnableIDs.includes(l.id))

    const result = await this.modalService.open<ConfirmationType>('bulk-edit', {
      learnables
    })

    if (result.type !== 'confirm') return

    const { update, deleteIDs, add } = result.value
    this.ls.updateCards(update)
    this.ls.deleteCards(deleteIDs)

    const { idsOfAll: idsOfAllAdded } = this.ls.importCards(add)
    const selectedCollection = this.selectedCollection()
    if (selectedCollection) {
      this.ls.updateCollection({ id: selectedCollection.id, addIDs: idsOfAllAdded })
    }
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

  selectAll() {
    const visibleIDs = this.visibleLearnables().map((l) => l.id)
    this.selectedLearnableIds.set(visibleIDs)
  }

  async deleteSelection() {
    const learnableIds = this.selectedLearnableIds()

    const result = await this.modalService.open<ConfirmationType>('confirm', {
      message: 'Are you shure you want to delete the selected cards?'
    })

    if (result.type !== 'confirm') return
    this.ls.deleteCards(learnableIds)
    this.toastService.showToast(`Removed ${learnableIds.length} cards.`)
    this.selectedLearnableIds.set([])
  }

  //  Collection Operations
  async addToCollection() {
    const learnableIds = this.selectedLearnableIds()
    const result = await this.modalService.open<ConfirmCollectionAddType>('collection-add', {
      collections: this.ls.collections(),
      cardIds: learnableIds
    })

    if (result.type !== 'confirm') return

    const collectionID = result.value.addToId || this.ls.createCollection(result.value.createName)
    this.ls.updateCollection({ id: collectionID, addIDs: learnableIds })
    this.selectedLearnableIds.set([])
    this.toastService.showToast('Added cards to collection.')
  }

  async removeFromCollection() {
    const collectionId = this.selectedCollection()?.id
    if (!collectionId) return

    const deleteIDs = this.selectedLearnableIds()
    this.ls.updateCollection({
      id: collectionId,
      deleteIDs
    })

    this.toastService.showToast(`Removed ${deleteIDs.length} cards from collection.`)
    this.selectedLearnableIds.set([])
  }

  async renameCollection(collection: Collection): Promise<void> {
    const result = await this.modalService.open<string>('collection-rename', {
      name: collection.name
    })

    if (result.type !== 'confirm') return

    this.ls.updateCollection({
      id: collection.id,
      name: result.value
    })
    this.toastService.showToast(`Collection renamed to ${result.value}.`)
  }

  async deleteCollection(collection: Collection): Promise<void> {
    const result = await this.modalService.open<ConfirmCollectionDeletionType>('collection-delete')

    if (result.type !== 'confirm') return

    if (result.value.deletionType === 'remove') this.ls.deleteCards(collection.cardIds)
    this.ls.deleteCollection(collection.id)

    this.toastService.showToast(`Collection ${collection.name} deleted.`)
  }
}
