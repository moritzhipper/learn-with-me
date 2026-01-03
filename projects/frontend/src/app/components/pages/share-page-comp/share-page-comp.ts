import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { mockUserBanks } from '@shared/testing/mockBanks'
import { BankShare } from '@shared/types'
import { forkJoin, Observable, pipe, switchMap, tap } from 'rxjs'
import { ApiService } from '../../../services/api-service'
import { ModalService } from '../../../services/modal-service'
import { ShareBanksService } from '../../../services/share-banks-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { ApiFetchState, ExplorePageCategoryConfig } from '../../../types_and_schemas/types'
import { mapToStaggerVM, StaggerVM } from '../../../utils/genaral-utils'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { SharedBankComp } from './shared-collection-comp/shared-bank-comp'

type PrefetchSectionProxy = {
  title: string
  params: ExplorePageCategoryConfig
}

type BanksPreviewSection = PrefetchSectionProxy & {
  banks: BankShare[]
}

@Component({
  selector: 'app-share-page-comp',
  imports: [PageHeaderComp, PageIconComp, SharedBankComp, IconComp, RouterLink, LoadingSpinner],
  templateUrl: './share-page-comp.html',
  styleUrl: './share-page-comp.scss',
  host: {
    class: 'page mid'
  }
})
export class SharePageComp {
  private readonly _toastS = inject(ToastService)
  private readonly _shareBanksS = inject(ShareBanksService)
  private readonly _modalService = inject(ModalService)
  private readonly _lStore = inject(LearnablesStore)
  private readonly _apiS = inject(ApiService)
  private readonly bankLanguage = computed(() => this._lStore.activeBank().language)
  protected readonly MAX_PREVIEW_BANKS = 5

  protected userBanks: BankShare[] = mockUserBanks(3)

  protected fetchState = signal<ApiFetchState>('idle')

  fetchBankPreviews = rxMethod<void>(
    pipe(
      tap(() => this.fetchState.set('loading')),
      switchMap(() =>
        this.getFetchBankPreviesObs().pipe(
          tapResponse({
            next: this.resolveApiResponses.bind(this),
            error: this.resolveApiError.bind(this)
          })
        )
      )
    )
  )

  private readonly prefetchSectionsConfig = computed<PrefetchSectionProxy[]>(() => [
    {
      title: 'Popular for your language match',
      params: { ...this.bankLanguage(), category: 'new' }
    },
    {
      title: 'New for your language match',
      params: { ...this.bankLanguage(), category: 'popular' }
    },
    { title: 'Popular for other matches', params: { category: 'popular' } },
    { title: 'New for other matches', params: { category: 'new' } }
  ])

  protected readonly previewBanks = signal<StaggerVM<BanksPreviewSection> | null>(null)

  constructor() {
    this.fetchBankPreviews()
  }

  protected async copyLink(bank: BankShare) {
    this._shareBanksS.copyLinkToClipboard(bank)
  }

  protected async importBank(bank: BankShare) {
    const result = await this._modalService.open<BankShare>('bank-import', {
      bank
    })

    if (result.type !== 'confirm') return
    this._lStore.importBankExport(result.value)
  }

  private getFetchBankPreviesObs(): Observable<BankShare[][]> {
    const sections = this.prefetchSectionsConfig().map((section) => {
      return this._apiS.getBanks({
        ...section.params,
        limit: this.MAX_PREVIEW_BANKS
      })
    })

    return forkJoin(sections)
  }

  private resolveApiResponses(bankShareLists: BankShare[][]): void {
    // map response back to sections by index
    const mappedResponse = this.prefetchSectionsConfig().map((section, index) => {
      return {
        title: section.title,
        banks: bankShareLists[index],
        params: section.params
      }
    })

    const sectionVM = mapToStaggerVM(mappedResponse)
    this.fetchState.set('idle')
    this.previewBanks.set(sectionVM)
  }

  private resolveApiError(error: any): void {
    this.fetchState.set('error')
  }
}
