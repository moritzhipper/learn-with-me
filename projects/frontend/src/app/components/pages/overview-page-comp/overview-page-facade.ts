import { inject, Injectable } from '@angular/core'
import { Collection } from '@shared/types'
import { ModalService } from '../../../services/modal-service'
import { ShareBanksService } from '../../../services/share-banks-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnables-store'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'

/**
 * Facade service for the overview page component.
 * Provides stateless methods for business logic and store interactions.
 * Does not hold state - all state is managed in the component.
 */
@Injectable({
  providedIn: 'root'
})
export class OverviewPageFacade {
  private readonly ls = inject(LearnablesStore)
  private readonly modalService = inject(ModalService)
  private readonly toastService = inject(ToastService)
  private readonly shareBanksS = inject(ShareBanksService)

  // ─────────────────────────────────────────────────────────────────────────────
  // Collection Operations
  // ─────────────────────────────────────────────────────────────────────────────

  async openAddToCollectionModal(learnableIds: string[]): Promise<void> {
    const result = await this.modalService.open<ConfirmCollectionAddType>('collection-add', {
      collections: this.ls.collections(),
      cardIds: learnableIds
    })

    if (result.type !== 'confirm') return

    const collectionID =
      'addToId' in result.value
        ? result.value.addToId
        : this.ls.createCollection(result.value.createName)

    this.ls.updateCollection({ id: collectionID, addIDs: learnableIds })
    this.toastService.showToast('Added cards to collection.')
  }

  async openRenameCollectionModal(collection: Collection): Promise<void> {
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

  downloadCollection(collectionId: string) {}
}
