import { DatePipe } from '@angular/common'
import { Component, computed, inject, input } from '@angular/core'
import { Router } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  remixBug2Fill,
  remixDeleteBin6Line,
  remixFolderDownloadLine,
  remixPencilFill,
  remixShareFill
} from '@ng-icons/remixicon'
import { Collection } from '@shared/types'
import { AnimDelayWrapper } from '../../../../directives/anim-delay-wrapper'
import { CardsSelector } from '../../../../services/cards-selector'
import { ModalService } from '../../../../services/modal-service'
import { ShareBanksService } from '../../../../services/share-banks-service'
import { ToastService } from '../../../../services/toast-service'
import { LearnablesStore } from '../../../../store/learnables-store'
import { aggregateConfidence } from '../../../../utils/genaral-utils'
import { LearnableComp } from '../../../shared/banks-and-collections/learnable-comp/learnable-comp'
import { PageHeaderCards } from '../../../shared/banks-and-collections/page-header-cards/page-header-cards'
import { Bubble } from '../../../shared/bubbles/bubble/bubble'
import { Bubbles } from '../../../shared/bubbles/bubbles'
import { ConfidenceStats } from '../../../shared/confidence/confidence-stats/confidence-stats'
import { ConfirmationType } from '../../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../../shared/forms/collection-add-comp/collection-add-comp'
import { ConfirmCollectionDeletionType } from '../../../shared/forms/delete-collection-comp/delete-collection-comp'
import {
  StartPracticeFormConfig,
  StartPracticeFormResult
} from '../../../shared/forms/start-practice-form/start-practice-form'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PracticeRatingComp } from '../../../shared/practice-rating-comp/practice-rating-comp'
import { PageWrapper } from '../../page-wrapper/page-wrapper'

@Component({
  selector: 'liz-user-collection-page',
  imports: [
    PageWrapper,
    LearnableComp,
    IconComp,
    Bubbles,
    Bubble,
    PageHeaderCards,
    ConfidenceStats,
    PracticeRatingComp,
    DatePipe,
    AnimDelayWrapper,
    NgIcon
  ],

  providers: [
    CardsSelector,
    provideIcons({
      remixBug2Fill,
      remixShareFill,
      remixPencilFill,
      remixFolderDownloadLine,
      remixDeleteBin6Line
    })
  ],
  templateUrl: './user-collection-page.html',
  styleUrl: './user-collection-page.scss'
})
export class UserCollectionPage {
  private readonly ls = inject(LearnablesStore)
  private readonly modalService = inject(ModalService)
  private readonly toastService = inject(ToastService)
  private readonly shareBanksS = inject(ShareBanksService)
  private router = inject(Router)
  protected readonly selector = inject(CardsSelector)

  // url segment
  readonly id = input.required<string>()

  share() {
    const collection = this.collection()
    if (!collection) return

    this.shareBanksS.shareBank(this.ls.activeBank(), [collection.id])
  }

  export(id: string) {
    this.shareBanksS.saveBankToDevice(this.ls.activeBank(), { onlyForCollectionIds: [id] })
  }

  protected confidence = computed(() => {
    if (this.collection()) return aggregateConfidence(this.sortedCards())
    return aggregateConfidence(this.ls.learnables())
  })

  protected collection = computed(() => {
    return this.ls.collections().find((c) => c.id === this.id())
  })

  // holds cards of collection or all cards having a collectio
  protected sortedCards = computed(() => {
    const collection = this.collection()
    const cards = this.ls.learnables()
    if (collection) {
      return cards.filter((card) => collection.cardIds.includes(card.id))
    }
    const collections = this.ls.collections()
    return cards.filter((card) => collections.some((c) => c.cardIds.includes(card.id)))
  })

  protected unsortedCards = computed(() => {
    const collectionIds = this.ls.collections().flatMap((c) => c.cardIds)
    return this.ls.learnables().filter((c) => !collectionIds.includes(c.id))
  })

  async renameCollection(coll: Collection): Promise<void> {
    const result = await this.modalService.open<string>('collection-rename', {
      name: coll.name
    })

    if (result.type !== 'confirm') return

    this.ls.updateCollection({
      id: coll.id,
      name: result.value
    })
    this.toastService.showToast(`Collection renamed to ${result.value}.`)
  }

  async deleteCollection(coll: Collection): Promise<void> {
    const result = await this.modalService.open<ConfirmCollectionDeletionType>('collection-delete')

    if (result.type !== 'confirm') return

    if (result.value.deletionType === 'remove') this.ls.deleteCards(coll.cardIds)
    this.ls.deleteCollection(coll.id)
    this.toastService.showToast(`Collection ${coll.name} deleted.`)
    this.router.navigate(['/cards'])
  }

  async practice() {
    const confidence = this.confidence()

    const hasActivePractice = !!this.ls.activeBank().practice.active

    const modalConfig: StartPracticeFormConfig = {
      confidence,
      languageConfig: this.ls.activeBank().language,
      hasActivePractice
    }

    const resetAndDirectionConfirmChoice = await this.modalService.open<StartPracticeFormResult>(
      'start-practice',
      {
        config: modalConfig
      }
    )

    if (resetAndDirectionConfirmChoice.type === 'cancel') return

    if (hasActivePractice) {
      this.ls.resetPracticeAndSaveToHistory()
    }

    const guessableField = resetAndDirectionConfirmChoice.value.guessableField

    const collection = this.collection()
    if (collection) {
      this.ls.startPractice({
        type: 'collection',
        collectionId: collection.id,
        learnableIDs: collection.cardIds,
        guessableField
      })
    } else {
      const learnableIDs = this.ls.learnables().map((c) => c.id)
      this.ls.startPractice({
        type: 'custom',
        learnableIDs,
        guessableField
      })
    }

    this.router.navigate(['/practice'])
  }

  async deleteSelection() {
    const learnableIds = [...this.selector.selected()]

    const result = await this.modalService.open<ConfirmationType>('confirm', {
      message: 'Delete cards',
      description: 'They will be permanently removed from your device'
    })

    if (result.type !== 'confirm') return
    this.ls.deleteCards(learnableIds)
    this.toastService.showToast(`Removed ${learnableIds.length} cards.`)
    this.selector.reset()
  }

  //  Collection Operations
  async addToCollection() {
    const learnableIds = [...this.selector.selected()]

    const result = await this.modalService.open<ConfirmCollectionAddType>('collection-add', {
      collections: this.ls.collections(),
      cardIds: learnableIds
    })

    if (result.type !== 'confirm') return

    const collectionID = result.value.addToId || this.ls.createCollection(result.value.createName)
    this.ls.updateCollection({ id: collectionID, addIDs: learnableIds })
    this.selector.reset()
    this.toastService.showToast('Added cards to collection.')
  }

  async removeFromCollection() {
    const collection = this.collection()
    if (!collection) return

    const result = await this.modalService.open('confirm', {
      message: 'Remove from collection',
      description: `Your cards will remain in your bank`
    })

    if (result.type !== 'confirm') return

    const deleteIDs = [...this.selector.selected()]
    this.ls.updateCollection({
      id: collection.id,
      deleteIDs
    })

    this.toastService.showToast(`Removed ${deleteIDs.length} cards from collection.`)
    this.selector.reset()
  }

  async bulkEdit() {
    const selected = this.selector.selected()
    const learnables = this.ls.learnables().filter((l) => selected.has(l.id))

    const result = await this.modalService.open<ConfirmationType>('bulk-edit', {
      learnables
    })

    if (result.type !== 'confirm') return

    const { update, deleteIDs, add } = result.value
    this.ls.updateCards(update)
    this.ls.deleteCards(deleteIDs)

    const { idsOfAll: idsOfAllAdded } = this.ls.importCards(add)
    const collection = this.collection()
    if (collection) {
      this.ls.updateCollection({ id: collection.id, addIDs: idsOfAllAdded })
    }
  }

  toggleAll() {
    const allIds = [...this.sortedCards(), ...this.unsortedCards()].map((c) => c.id)
    this.selector.toggleAll(allIds)
  }
}
