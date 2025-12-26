import { Component, effect, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LanguageConfigSchema } from '@shared/schemas'
import { BankShare, LanguageConfig } from '@shared/types'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import { PageHeaderComp } from '../../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../../shared/page-icon-comp/page-icon-comp'

@Component({
  selector: 'app-explore-page-comp',
  imports: [PageIconComp, PageHeaderComp],
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

  private readonly PAGE_LIMIT = 20
  private readonly activeOffset = 0

  private readonly visibleBanks = signal<BankShare[]>([])

  params = signal<LanguageConfig>(this.initParams())

  constructor() {
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
}
