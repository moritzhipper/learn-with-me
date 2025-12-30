import { Component, DOCUMENT, effect, HostListener, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BanksRequestFilterSchema, LanguageConfigSchema } from '@shared/schemas'
import { BankShare } from '@shared/types'
import { ApiService } from 'projects/frontend/src/app/services/api-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import {
  ApiFetchState,
  ExplorePageCategoryConfig
} from 'projects/frontend/src/app/types_and_schemas/types'
import { mapToStaggerVM, StaggerVM } from 'projects/frontend/src/app/utils/genaral-utils'
import { lastValueFrom } from 'rxjs'
import { LoadingSpinner } from '../../../shared/loading-spinner/loading-spinner'
import { PageHeaderComp } from '../../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../../shared/page-icon-comp/page-icon-comp'
import { SharedBankComp } from '../shared-collection-comp/shared-bank-comp'

@Component({
  selector: 'app-explore-page-comp',
  imports: [PageIconComp, PageHeaderComp, SharedBankComp, LoadingSpinner],
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

  private readonly LOAD_MORE_SCROLL_THRESHOLD_PX = 800

  protected readonly fetchState = signal<ApiFetchState>('idle')

  private readonly PAGE_LIMIT = 15
  private PAGE_OFFSET = 0

  protected readonly visibleBanksVM = signal<StaggerVM<BankShare>>([])
  params = signal<ExplorePageCategoryConfig>(this.initParams())

  document = inject(DOCUMENT)

  @HostListener('window:scroll')
  onScroll() {
    this.loadNextPage()
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
      const queryParams = this.route.snapshot.queryParams
      const language = LanguageConfigSchema.parse({
        speaking: queryParams['speaking'],
        learning: queryParams['learning']
      })
      const category = BanksRequestFilterSchema.parse({
        category: queryParams['category']
      })

      return { ...language, ...category }
    } catch {
      return { ...this.lStore.activeBank().language, category: 'popular' }
    }
  }

  // lade page, warte bis erfolg, speicher antwort in visiblebanks, setze page++
  async loadNextPage() {
    if (!this.overLoadingThreshold() || this.fetchState() !== 'idle') return

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
      const timeSpread = 0.3
      const bankVM = mapToStaggerVM(banks, timeSpread)
      this.visibleBanksVM.set([...this.visibleBanksVM(), ...bankVM])

      if (banks.length < this.PAGE_LIMIT) {
        this.fetchState.set('all-loaded')
      } else {
        this.PAGE_OFFSET = this.PAGE_OFFSET + banks.length
        this.fetchState.set('idle')
        this.loadNextPage()
      }
    } catch {
      this.fetchState.set('error')
    }
  }

  // setze page auf 0, leere visiblebanks,
  updateLanguage() {
    this.PAGE_OFFSET = 0
    this.visibleBanksVM.set([])
    this.fetchState.set('idle')
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
}
