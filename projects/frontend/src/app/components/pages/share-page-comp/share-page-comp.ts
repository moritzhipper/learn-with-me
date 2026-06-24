import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { BankShareViaDB } from '@shared/types'
import { forkJoin, Observable, pipe, switchMap, tap } from 'rxjs'
import { AnimDelay } from '../../../services/anim-delay'
import { ApiService } from '../../../services/api-service'
import { ShareBanksService } from '../../../services/share-banks-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnables-store'
import { ApiFetchState, ExplorePageCategoryConfig } from '../../../types/types'
import { HeaderLink } from '../../shared/header-link/header-link'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { PagePlaceholderComp } from '../../shared/page-placeholder-comp/page-placeholder-comp'
import { SharedBankComp } from './shared-collection-comp/shared-bank-comp'

type PrefetchSectionProxy =
  | {
      type: 'community'
      title: string
      params: ExplorePageCategoryConfig
    }
  | {
      type: 'user'
      title: string
    }

type BanksPreviewSection = PrefetchSectionProxy & {
  banks: BankShareViaDB[]
}

@Component({
  selector: 'app-share-page-comp',
  imports: [
    PageHeaderComp,
    PageIconComp,
    SharedBankComp,
    IconComp,
    RouterLink,
    LoadingSpinner,
    PagePlaceholderComp,
    HeaderLink,
    AnimDelay
  ],
  templateUrl: './share-page-comp.html',
  styleUrl: './share-page-comp.scss',
  host: {
    class: 'page mid'
  }
})
export class SharePageComp {
  private readonly _toastS = inject(ToastService)
  private readonly _shareBanksS = inject(ShareBanksService)
  private readonly ls = inject(LearnablesStore)
  private readonly _apiS = inject(ApiService)
  private readonly bankLanguage = computed(() => this.ls.activeBank().language)
  protected readonly MAX_PREVIEW_BANKS = 8

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
    { title: 'You shared', type: 'user' },
    {
      title: 'Popular for your active match',
      params: { ...this.bankLanguage(), sortBy: 'new' },
      type: 'community'
    },
    {
      title: 'New for your active match',
      params: { ...this.bankLanguage(), sortBy: 'top' },
      type: 'community'
    },
    { title: 'Popular on lingolizard', params: { sortBy: 'top' }, type: 'community' },
    { title: 'New on lingolizard', params: { sortBy: 'new' }, type: 'community' }
  ])

  protected readonly previewBanks = signal<BanksPreviewSection[] | null>(null)

  constructor() {
    this.fetchBankPreviews()
  }

  protected async copyLink(bank: BankShareViaDB) {
    this._shareBanksS.copyLinkToClipboard(bank.id, bank.name)
  }

  protected async importBank(bank: BankShareViaDB) {
    await this._shareBanksS.importOnlineBank(bank)
  }

  private getFetchBankPreviesObs(): Observable<BankShareViaDB[][]> {
    const sections = this.prefetchSectionsConfig().map((section) => {
      if (section.type === 'community') {
        return this._apiS.getCommunityBanks({
          ...section.params,
          limit: this.MAX_PREVIEW_BANKS
        })
      } else {
        return this._apiS.getUserBanks()
      }
    })

    return forkJoin(sections)
  }

  private resolveApiResponses(bankShareLists: BankShareViaDB[][]): void {
    // map response back to sections by index
    const mappedResponse = this.prefetchSectionsConfig()
      .map((section, index) => ({
        ...section,
        banks: bankShareLists[index]
      }))
      .filter((section) => section.banks.length > 0)

    if (mappedResponse.length === 0) {
      this.fetchState.set('no-data')
    } else {
      this.fetchState.set('idle')
      this.previewBanks.set(mappedResponse)
    }
  }

  private resolveApiError(error: any): void {
    this.fetchState.set('error')
    this._toastS.showToast({
      header: 'Error',
      message: 'Failed to load preview Banks.',
      type: 'error'
    })
  }
}
