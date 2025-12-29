import { Component, computed, inject, signal } from '@angular/core'
import { Params, RouterLink } from '@angular/router'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { mockUserBanks } from '@shared/testing/mockBanks'
import { BankShare } from '@shared/types'
import { forkJoin, pipe, switchMap } from 'rxjs'
import { ApiService } from '../../../services/api-service'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { SharedBankComp } from './shared-collection-comp/shared-bank-comp'

type PreFetchResponse = {
  newForMatch: BankShare[]
  popularForMatch: BankShare[]
  newForOther: BankShare[]
  popularForOther: BankShare[]
}

type BanksPreviewSection = {
  title: string
  banks: BankShare[]
  params: Params
}

@Component({
  selector: 'app-share-page-comp',
  imports: [PageHeaderComp, PageIconComp, SharedBankComp, IconComp, RouterLink],
  templateUrl: './share-page-comp.html',
  styleUrl: './share-page-comp.scss',
  host: {
    class: 'page mid'
  }
})
export class SharePageComp {
  private readonly _toastS = inject(ToastService)
  private readonly _modalService = inject(ModalService)
  private readonly _lStore = inject(LearnablesStore)
  private readonly _apiS = inject(ApiService)
  private readonly bankLanguage = computed(() => this._lStore.activeBank().language)
  protected readonly MAX_PREVIEW_BANKS = 5

  userBanks: BankShare[] = mockUserBanks(3)

  fetchBankPreviews = rxMethod<void>(
    pipe(
      switchMap(() => this.fetchBankPreviesObs()),
      tapResponse({
        next: this.setPreviewBanks.bind(this),
        error: console.error
      })
    )
  )

  protected readonly previewBanks = signal<BanksPreviewSection[] | null>(null)

  constructor() {
    this.fetchBankPreviews()
  }

  protected async copyLink(bank: BankShare) {
    try {
      await navigator.clipboard.writeText(this.generateLink(bank.id))

      this._toastS.showToast({
        type: 'info',
        message: `Link to ${bank.name} copied to clipboard`
      })
    } catch {
      this._toastS.showToast({
        type: 'error',
        message: `Failed to copy link. Do you have the clipboard permissions enabled?`
      })
    }
  }

  protected async importBank(bank: BankShare) {
    const result = await this._modalService.open<BankShare>('bank-import', {
      bank
    })

    if (result.type !== 'confirm') return
    this._lStore.importBankExport(result.value)
  }

  private generateLink(id: string): string {
    const url = new URL(window.location.origin)
    url.searchParams.set('id', id)
    return url.toString()
  }

  private fetchBankPreviesObs() {
    const limit = this.MAX_PREVIEW_BANKS

    const popularForMatch = this._apiS.getBanks({
      ...this.bankLanguage(),
      category: 'popular',
      limit
    })

    const newForMatch = this._apiS.getBanks({
      ...this.bankLanguage(),
      category: 'new',
      limit
    })

    const popularForOther = this._apiS.getBanks({
      category: 'popular',
      limit
    })

    const newForOther = this._apiS.getBanks({
      category: 'new',
      limit
    })

    return forkJoin({ newForMatch, popularForMatch, newForOther, popularForOther })
  }

  protected setPreviewBanks(response: PreFetchResponse) {
    this.previewBanks.set([
      {
        title: 'Popular for your language match',
        banks: response.popularForMatch,
        params: this.bankLanguage()
      },
      {
        title: 'New for your language match',
        banks: response.newForMatch,
        params: this.bankLanguage()
      },
      {
        title: 'Popular for other matches',
        banks: response.popularForOther,
        params: {}
      },
      {
        title: 'New for other matches',
        banks: response.newForOther,
        params: {}
      }
    ])
  }
}
