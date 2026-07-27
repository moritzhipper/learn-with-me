import { Component, computed, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalService } from '../../../../services/modal-service'
import { ShareBanksService } from '../../../../services/share-banks-service'
import { ToastService } from '../../../../services/toast-service'
import { LearnablesStore } from '../../../../store/learnables-store'
import { aggregateConfidence } from '../../../../utils/genaral-utils'
import { ConfidenceStats } from '../../../shared/confidence/confidence-stats/confidence-stats'
import { ConfirmCollectionDeletionType } from '../../../shared/forms/delete-collection-comp/delete-collection-comp'
import {
  StartPracticeFormConfig,
  StartPracticeFormResult
} from '../../../shared/forms/start-practice-form/start-practice-form'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../../shared/page-header-comp/page-header-comp'
import { PracticeRatingComp } from '../../../shared/practice-rating-comp/practice-rating-comp'
import { LearnableComp } from '../../overview-page-comp/learnable-comp/learnable-comp'
import { PageWrapper } from '../../page-wrapper/page-wrapper'

@Component({
  selector: 'liz-user-collection-page',
  imports: [
    PageHeaderComp,
    PageWrapper,
    LearnableComp,
    ConfidenceStats,
    PracticeRatingComp,
    IconComp
  ],
  templateUrl: './user-collection-page.html',
  styleUrl: './user-collection-page.scss'
})
export class UserCollectionPage {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly ls = inject(LearnablesStore)
  private readonly modalService = inject(ModalService)
  private readonly toastService = inject(ToastService)
  private readonly shareBanksS = inject(ShareBanksService)
  private router = inject(Router)

  share() {
    const collection = this.collection()
    if (!collection) return

    this.shareBanksS.shareBank(this.ls.activeBank(), [collection.id])
  }

  export() {
    const collection = this.collection()
    if (!collection) return

    this.shareBanksS.exportBank(this.ls.activeBank(), { onlyForCollectionIds: [collection.id] })
  }

  protected confidence = computed(() => aggregateConfidence(this.cards()))

  protected collection = computed(() => {
    const collectionId = this.activatedRoute.snapshot.paramMap.get('id')
    return this.ls.collections().find((c) => c.id === collectionId)
  })

  protected cards = computed(() => {
    const collection = this.collection()
    return collection
      ? this.ls.learnables().filter((card) => collection.cardIds.includes(card.id))
      : []
  })

  async renameCollection(): Promise<void> {
    const collection = this.collection()
    if (!collection) return
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

  async deleteCollection(): Promise<void> {
    const collection = this.collection()
    if (!collection) return

    const result = await this.modalService.open<ConfirmCollectionDeletionType>('collection-delete')

    if (result.type !== 'confirm') return

    if (result.value.deletionType === 'remove') this.ls.deleteCards(collection.cardIds)
    this.ls.deleteCollection(collection.id)

    this.toastService.showToast(`Collection ${collection.name} deleted.`)
  }

  async practice() {
    const confidence = this.confidence()
    const collection = this.collection()

    if (!confidence || !collection) return

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

    // Start new with action config, then redirect
    // Just redirect, when customize or continue selected
    this.ls.startPractice({
      type: 'collection',
      collectionId: collection.id,
      learnableIDs: collection.cardIds,
      guessableField
    })

    this.router.navigate(['/practice'])
  }
}
