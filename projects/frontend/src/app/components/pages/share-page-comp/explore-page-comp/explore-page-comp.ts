import { Component, DOCUMENT, effect, HostListener, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LanguageConfigSchema } from '@shared/schemas'
import { BankShare, LanguageConfig } from '@shared/types'
import { ApiService } from 'projects/frontend/src/app/services/api-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import { lastValueFrom } from 'rxjs'
import { PageHeaderComp } from '../../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../../shared/page-icon-comp/page-icon-comp'
import { SharedBankComp } from '../shared-collection-comp/shared-bank-comp'

type PageFetchState = 'loading' | 'idle' | 'error' | 'all-loaded'

@Component({
  selector: 'app-explore-page-comp',
  imports: [PageIconComp, PageHeaderComp, SharedBankComp],
  templateUrl: './explore-page-comp.html',
  styleUrl: './explore-page-comp.scss',
  host: {
    class: 'page wide'
  }
})
export class ExplorePageComp {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly lStore = inject(LearnablesStore)
  private readonly apiS = inject(ApiService)

  private fetchState = signal<PageFetchState>('idle')

  private readonly PAGE_LIMIT = 20
  private PAGE_OFFSET = 0

  protected readonly visibleBanks = signal<BankShare[]>([])
  params = signal<LanguageConfig>(this.initParams())

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
  initParams(): LanguageConfig {
    try {
      const queryParams = this.route.snapshot.queryParams
      return LanguageConfigSchema.parse({
        speaking: queryParams['speaking'],
        learning: queryParams['learning']
      })
    } catch {
      return this.lStore.activeBank().language
    }
  }

  // lade page, warte bis erfolg, speicher antwort in visiblebanks, setze page++
  async loadNextPage() {
    if (
      !this.shouldLoadMore() ||
      this.fetchState() === 'loading' ||
      this.fetchState() === 'all-loaded'
    ) {
      return
    }

    this.fetchState.set('loading')
    try {
      const banks = await lastValueFrom(
        this.apiS.getBanks({
          category: 'new',
          ...this.params(),
          offset: this.PAGE_OFFSET,
          limit: this.PAGE_LIMIT
        })
      )
      this.visibleBanks.set([...this.visibleBanks(), ...banks])
      this.PAGE_OFFSET = this.PAGE_OFFSET + this.PAGE_LIMIT

      if (banks.length === 0) {
        this.fetchState.set('all-loaded')
      } else {
        this.loadNextPage()
        this.fetchState.set('idle')
      }

      // make sure that always more banks are loaded than fit on the screen
    } catch {
      this.fetchState.set('error')
      // send toast?
      // show retry button in gui?
    }
  }

  // setze page auf 0, leere visiblebanks,
  updateLanguage() {
    this.PAGE_OFFSET = 0
    this.visibleBanks.set([])
    this.fetchState.set('idle')
  }

  private shouldLoadMore(): boolean {
    // scroll, when distance of documentheight to bottom of window < threshold

    const THRESHOLD = 500

    // browser window height
    const windowHeight = window.innerHeight

    // document height
    const documentHeight = this.document.documentElement.scrollHeight

    // scroll progress
    const scrollProg = window.scrollY

    const distanceDocEndWindowEnd = documentHeight - (scrollProg + windowHeight)

    const shouldLoad = distanceDocEndWindowEnd < THRESHOLD
    console.log({ documentHeight, windowHeight, scrollProg, distanceDocEndWindowEnd, shouldLoad })

    return shouldLoad
  }
}
