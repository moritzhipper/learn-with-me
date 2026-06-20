import { inject, Injectable } from '@angular/core'
import { BankUser, CollectionUser, LearnableBase } from '@shared/types'
import { ModalService } from '../../../services/modal-service'
import { ShareBanksService } from '../../../services/share-banks-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { filterLearnables } from '../../../utils/learnables-filter'
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
  ): Promise<boolean> {
    const learnables = this.store.learnables().filter((l) => selectedLearnableIds.includes(l.id))

    const result = await this.modalService.open<ConfirmationType>('bulk-edit', {
      learnables
    })

    if (result.type !== 'confirm') return false

    const { update, deleteIDs, add } = result.value
    this.store.updateLearnables(update)
    this.store.removeLearnables(deleteIDs)
    return this.addLearnablesToStore(add, selectedCollection)
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

    this.store.removeLearnables(learnableIds)
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

    const { createName, addToId } = result.value
    const collectionName = this.addLearnablesToCollection(learnableIds, createName, addToId)

    this.toastService.showToast(`Added ${learnableIds.length} cards to ${collectionName}.`)
  }

  removeLearnablesFromCollection(collectionId: string, learnableIds: string[]): void {
    this.store.editCollectionLearnables(collectionId, [], learnableIds)
    this.toastService.showToast(`Removed ${learnableIds.length} cards from collection.`)
  }

  async openRenameCollectionModal(collection: CollectionUser): Promise<void> {
    const result = await this.modalService.open<string>('collection-rename', {
      name: collection.name
    })

    if (result.type !== 'confirm') return

    this.store.editCollection(collection.id, result.value)
  }

  async openDeleteCollectionModal(collection: CollectionUser): Promise<void> {
    const result = await this.modalService.open<ConfirmCollectionDeletionType>('collection-delete')

    if (result.type !== 'confirm') return

    const removeCardsCompletely = result.value.deletionType === 'remove'
    this.store.deleteCollection(collection.id, removeCardsCompletely)
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

  // ─────────────────────────────────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  private addLearnablesToStore(
    learnables: LearnableBase[],
    selectedCollection: CollectionUser | null
  ): boolean {
    if (learnables.length === 0) return false

    const countBefore = this.store.learnables().length
    this.store.addLearnables(learnables)
    const countAfter = this.store.learnables().length
    const addedCount = countAfter - countBefore

    if (addedCount === 0) {
      this.toastService.showToast({
        message: 'No cards added — all were duplicates.',
        type: 'error'
      })
      return false
    }

    const newIds = filterLearnables(this.store.learnables(), {
      age: 'newest'
    }).map((l) => l.id)

    if (selectedCollection) {
      this.store.editCollectionLearnables(selectedCollection.id, newIds, [])
      this.toastService.showToast(
        `Created ${addedCount} cards and added them to ${selectedCollection.name}.`
      )
    } else {
      this.toastService.showToast(`Created ${addedCount} cards.`)
    }

    return true
  }

  private addLearnablesToCollection(
    learnableIds: string[],
    createName?: string,
    addToId?: string
  ): string {
    if (createName) {
      this.store.createCollection(createName, learnableIds)
      return createName
    }

    if (addToId) {
      this.store.editCollectionLearnables(addToId, learnableIds, [])
      return this.store.collections().find((c) => c.id === addToId)?.name ?? 'collection'
    }

    return 'collection'
  }
}
