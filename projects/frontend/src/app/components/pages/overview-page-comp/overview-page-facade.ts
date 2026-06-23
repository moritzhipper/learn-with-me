import { inject, Injectable } from '@angular/core'
import { BankUser, CollectionUser } from '@shared/types'
import { ModalService } from '../../../services/modal-service'
import { ShareBanksService } from '../../../services/share-banks-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { ConfirmationType } from '../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { ConfirmCollectionDeletionType } from '../../shared/forms/delete-collection-comp/delete-collection-comp'

/**
 * Facade service for the overview page component.
 * Provides stateless methods for business logic and store interactions.
 * Does not hold state - all state is managed in the component.
 */
@Injectable({
  providedIn: 'root'
})
export class OverviewPageFacade {
  private readonly store = inject(LearnablesStore)
  private readonly modalService = inject(ModalService)
  private readonly toastService = inject(ToastService)
  private readonly shareBanksS = inject(ShareBanksService)

  // ─────────────────────────────────────────────────────────────────────────────
  // Learnable Operations
  // ─────────────────────────────────────────────────────────────────────────────

  async openBulkEditModal(
    selectedLearnableIds: string[],
    selectedCollection: CollectionUser | null
  ): Promise<void> {
    const learnables = this.store.learnables().filter((l) => selectedLearnableIds.includes(l.id))

    const result = await this.modalService.open<ConfirmationType>('bulk-edit', {
      learnables
    })

    if (result.type !== 'confirm') return

    const { update, deleteIDs, add } = result.value
    this.store.updateCards(update)
    this.store.deleteCards(deleteIDs)

    const newIds = this.store.createCards(add)
    if (selectedCollection) {
      this.store.updateCollection({ id: selectedCollection.id, addIDs: newIds })
    }
  }

  async confirmAndDeleteLearnables(learnableIds: string[]): Promise<void> {
    const count = learnableIds.length
    const message =
      count === 1
        ? 'Are you sure you want to delete this card?'
        : `Are you sure you want to delete ${count} cards?`

    const result = await this.modalService.open<ConfirmationType>('confirm', {
      message
    })

    if (result.type !== 'confirm') return
    this.store.deleteCards(learnableIds)
    this.toastService.showToast(`Removed ${count} cards.`)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Collection Operations
  // ─────────────────────────────────────────────────────────────────────────────

  async openAddToCollectionModal(learnableIds: string[]): Promise<void> {
    const result = await this.modalService.open<ConfirmCollectionAddType>('collection-add', {
      collections: this.store.collections(),
      cardIds: learnableIds
    })

    if (result.type !== 'confirm') return

    const collectionID =
      'addToId' in result.value
        ? result.value.addToId
        : this.store.createCollection(result.value.createName)

    this.store.updateCollection({ id: collectionID, addIDs: learnableIds })
    this.toastService.showToast('Added cards to collection.')
  }

  removeLearnablesFromCollection(collectionId: string, ids: string[]): void {
    this.store.updateCollection({
      id: collectionId,
      deleteIDs: ids
    })
    this.toastService.showToast(`Removed ${ids.length} cards from collection.`)
  }

  async openRenameCollectionModal(collection: CollectionUser): Promise<void> {
    const result = await this.modalService.open<string>('collection-rename', {
      name: collection.name
    })

    if (result.type !== 'confirm') return

    this.store.updateCollection({
      id: collection.id,
      name: result.value
    })
    this.toastService.showToast(`Collection renamed to ${result.value}.`)
  }

  async openDeleteCollectionModal(collection: CollectionUser): Promise<void> {
    const result = await this.modalService.open<ConfirmCollectionDeletionType>('collection-delete')

    if (result.type !== 'confirm') return

    if (result.value.deletionType === 'remove') this.store.deleteCards(collection.cardIds)
    this.store.deleteCollection(collection.id)

    this.toastService.showToast(`Collection ${collection.name} deleted.`)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sharing & Export Operations
  // ─────────────────────────────────────────────────────────────────────────────

  async openShareCollectionModal(bank: BankUser, collectionId: string): Promise<void> {
    this.shareBanksS.shareBank(bank, [collectionId])
  }

  downloadCollection(collectionId: string) {
    this.shareBanksS.exportBank(this.store.activeBank(), [collectionId])
  }
}
