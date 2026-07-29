import { Component, computed, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Collection } from '@shared/types'
import { CardsSelector } from '../../../../services/cards-selector'
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
  providers: [CardsSelector],
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
  protected readonly selector = inject(CardsSelector)

  share() {
    const collection = this.collection()
    if (!collection) return

    this.shareBanksS.shareBank(this.ls.activeBank(), [collection.id])
  }

  export(id: string) {
    this.shareBanksS.exportBank(this.ls.activeBank(), { onlyForCollectionIds: [id] })
  }

  protected confidence = computed(() => {
    if (this.collection()) return aggregateConfidence(this.sortedCards())

    return aggregateConfidence(this.ls.learnables())
  })

  protected collection = computed(() => {
    const collectionId = this.activatedRoute.snapshot.paramMap.get('id')
    return this.ls.collections().find((c) => c.id === collectionId)
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
}
