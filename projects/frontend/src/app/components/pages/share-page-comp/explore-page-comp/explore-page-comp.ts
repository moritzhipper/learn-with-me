import { Component, DOCUMENT, effect, HostListener, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BanksRequestSchema } from '@shared/schemas'
import { BankRequestFilter, BankShare, LanguageConfig } from '@shared/types'
import { ApiService } from 'projects/frontend/src/app/services/api-service'
import { ModalService } from 'projects/frontend/src/app/services/modal-service'
import { ShareBanksService } from 'projects/frontend/src/app/services/share-banks-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import {
  ApiFetchState,
  ExplorePageCategoryConfig
} from 'projects/frontend/src/app/types_and_schemas/types'
import { mapToStaggerVM, StaggerVM } from 'projects/frontend/src/app/utils/genaral-utils'
import { lastValueFrom } from 'rxjs'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { LoadingSpinner } from '../../../shared/loading-spinner/loading-spinner'
import { PageHeaderComp } from '../../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../../shared/page-icon-comp/page-icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'
import { SharedBankComp } from '../shared-collection-comp/shared-bank-comp'

@Component({
  selector: 'app-explore-page-comp',
  imports: [
    PageIconComp,
    PageHeaderComp,
    SharedBankComp,
    LoadingSpinner,
    IconComp,
    RadioComp,
    FormsModule
  ],
  templateUrl: './explore-page-comp.html',
  styleUrl: './explore-page-comp.scss',
  host: {
    class: 'page mid'
  }
})
export class ExplorePageComp {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly lStore = inject(LearnablesStore)
  private readonly apiS = inject(ApiService)
  private readonly shareBanksS = inject(ShareBanksService)
  private readonly _modalService = inject(ModalService)

  private readonly LOAD_MORE_SCROLL_THRESHOLD_PX = 800

  protected readonly fetchState = signal<ApiFetchState>('idle')

  private readonly PAGE_LIMIT = 15
  private PAGE_OFFSET = 0

  protected readonly visibleBanksVM = signal<StaggerVM<BankShare>>([])
  params = signal<ExplorePageCategoryConfig>(this.initParams())

  document = inject(DOCUMENT)

  @HostListener('window:scroll')
  onScroll() {
    if (this.overLoadingThreshold()) {
      this.loadNextPage()
    }
  }

  constructor() {
    this.loadNextPage()
    // sync URL params with component state
    effect(() => {
      this.router.navigate([], {
        queryParams: { ...this.params() },
        queryParamsHandling: 'merge'
      })
    })
  }

  // TODO: handle null param for random language
  initParams(): ExplorePageCategoryConfig {
    try {
      const parsedParams = BanksRequestSchema.omit({ limit: true, offset: true }).parse(
        this.route.snapshot.queryParams
      )

      return parsedParams
    } catch {
      const activeBankLang = this.lStore.activeBank().language
      return { ...activeBankLang, category: 'popular' }
    }
  }

  // lade page, warte bis erfolg, speicher antwort in visiblebanks, setze page++
  async loadNextPage() {
    if (this.fetchState() !== 'idle') return

    this.fetchState.set('loading')
    try {
      const banks = await lastValueFrom(
        this.apiS.getBanks({
          ...this.params(),
          offset: this.PAGE_OFFSET,
          limit: this.PAGE_LIMIT
        })
      )

      // makes the last banks animation appear after 0.2s
      const bankVM = mapToStaggerVM(banks)
      this.visibleBanksVM.set([...this.visibleBanksVM(), ...bankVM])

      if (banks.length < this.PAGE_LIMIT) {
        this.fetchState.set('all-loaded')
      } else {
        this.PAGE_OFFSET = this.PAGE_OFFSET + banks.length
        this.fetchState.set('idle')
        if (this.overLoadingThreshold()) {
          this.loadNextPage()
        }
      }
    } catch {
      this.fetchState.set('error')
    }
  }

  updateCategory(category: BankRequestFilter['category']) {
    this.updateParams({ category })
  }

  // setze page auf 0, leere visiblebanks,
  updateParams(p: Partial<ExplorePageCategoryConfig>) {
    this.PAGE_OFFSET = 0
    this.fetchState.set('idle')
    this.visibleBanksVM.set([])
    this.params.update((old) => ({ ...old, ...p }))
    this.loadNextPage()
  }

  private overLoadingThreshold(): boolean {
    // scroll, when distance of documentheight to bottom of window < threshold

    // browser window height
    const windowHeight = window.innerHeight

    // document height
    const documentHeight = this.document.documentElement.scrollHeight

    // scroll progress
    const scrollProg = window.scrollY

    const distanceDocEndWindowEnd = documentHeight - (scrollProg + windowHeight)

    return distanceDocEndWindowEnd < this.LOAD_MORE_SCROLL_THRESHOLD_PX
  }

  copyBankId(bank: BankShare) {
    this.shareBanksS.copyLinkToClipboard(bank)
  }

  protected async importBank(bank: BankShare) {
    const result = await this._modalService.open<BankShare>('bank-import', {
      bank
    })

    if (result.type !== 'confirm') return
    this.lStore.importBankExport(result.value)
  }

  async changeLanguageMatch() {
    const result = await this._modalService.open<LanguageConfig>('change-language-match', {
      preset: {
        learning: this.params().learning,
        speaking: this.params().speaking
      }
    })
    if (result.type !== 'confirm') return

    this.updateParams({ ...result.value, category: 'popular' })
  }
}
