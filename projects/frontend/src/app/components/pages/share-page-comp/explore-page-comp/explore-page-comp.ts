import { Component, DOCUMENT, effect, HostListener, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BanksRequestSchema } from '@shared/schemas'
import { BankRequestConfig, BankShareViaDB, LanguageConfig } from '@shared/types'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { ApiService } from 'projects/frontend/src/app/services/api-service'
import { ModalService } from 'projects/frontend/src/app/services/modal-service'
import { ShareBanksService } from 'projects/frontend/src/app/services/share-banks-service'
import { ToastService } from 'projects/frontend/src/app/services/toast-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import { ApiFetchState, ExplorePageCategoryConfig } from 'projects/frontend/src/app/types/types'
import { lastValueFrom } from 'rxjs'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { LoadingSpinner } from '../../../shared/loading-spinner/loading-spinner'
import { PageHeaderComp } from '../../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../../shared/page-icon-comp/page-icon-comp'
import { PagePlaceholderComp } from '../../../shared/page-placeholder-comp/page-placeholder-comp'
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
    FormsModule,
    PagePlaceholderComp,
    AnimDelay
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
  private readonly toastS = inject(ToastService)
  private readonly ls = inject(LearnablesStore)
  private readonly apiS = inject(ApiService)
  private readonly shareBanksS = inject(ShareBanksService)
  private readonly _modalService = inject(ModalService)

  private readonly LOAD_MORE_SCROLL_THRESHOLD_PX = 800

  protected readonly fetchState = signal<ApiFetchState>('idle')

  private readonly PAGE_LIMIT = 15
  private PAGE_OFFSET = 0

  protected readonly visibleBanks = signal<BankShareViaDB[]>([])
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
      const activeBankLang = this.ls.activeBank().language
      return { ...activeBankLang, sortBy: 'top' }
    }
  }

  // lade page, warte bis erfolg, speicher antwort in visiblebanks, setze page++
  async loadNextPage() {
    if (this.fetchState() !== 'idle') return

    this.fetchState.set('loading')
    try {
      const banks = await lastValueFrom(
        this.apiS.getCommunityBanks({
          ...this.params(),
          offset: this.PAGE_OFFSET,
          limit: this.PAGE_LIMIT
        })
      )

      this.visibleBanks.set([...this.visibleBanks(), ...banks])

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
      this.toastS.showToast({
        header: 'Error',
        message: 'Failed to load more Banks.',
        type: 'error'
      })
    }
  }

  updateCategory(category: BankRequestConfig['sortBy']) {
    this.updateParams({ sortBy: category })
  }

  // set page to 0, empty visiblebanks
  updateParams(p: Partial<ExplorePageCategoryConfig>) {
    this.PAGE_OFFSET = 0
    this.fetchState.set('idle')
    this.visibleBanks.set([])
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

  copyBankId(bank: BankShareViaDB) {
    this.shareBanksS.copyLinkToClipboard(bank.id, bank.name)
  }

  protected async importBank(bank: BankShareViaDB) {
    await this.shareBanksS.importOnlineBank(bank)
  }

  async changeLanguageMatch() {
    const result = await this._modalService.open<LanguageConfig>('change-language-match', {
      preset: {
        learning: this.params().learning,
        speaking: this.params().speaking
      }
    })
    if (result.type !== 'confirm') return

    this.updateParams({ ...result.value, sortBy: 'top' })
  }
}
