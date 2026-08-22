import { Component, computed, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { dashboardPageIcon } from '../../../icon-registry'
import { ApiService } from '../../../services/api-service'
import { LearnablesStore } from '../../../store/learnables-store'
import { CardsQuickSelector } from '../../shared/banks-and-collections/cards-quick-selector/cards-quick-selector'
import { CardsStack } from '../../shared/banks-and-collections/cards-stack/cards-stack'
import { SharedBankComp } from '../../shared/banks-and-collections/shared-bank-comp/shared-bank-comp'
import { HeaderLink } from '../../shared/header-link/header-link'
import { InfoCard } from '../../shared/info-card/info-card'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PracticeQuickActions } from '../../shared/practice-quick-actions/practice-quick-actions'
import { PageWrapper } from '../page-wrapper/page-wrapper'
import { QuickLinks } from './quick-links/quick-links'

@Component({
  selector: 'app-dashboard-page',
  imports: [
    PageHeaderComp,
    HeaderLink,
    PracticeQuickActions,
    CardsQuickSelector,
    SharedBankComp,
    PageWrapper,
    InfoCard,
    QuickLinks,
    RouterLink,
    CardsStack
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage {
  private readonly apiS = inject(ApiService)
  private readonly ls = inject(LearnablesStore)
  protected bankHasCards = computed(() => this.ls.activeBank().learnables.length !== 0)

  protected readonly bookIcon = dashboardPageIcon

  sharedBanks = rxResource({
    params: () => this.ls.activeBank().language,
    stream: ({ params }) =>
      this.apiS.getCommunityBanks({
        limit: 10,
        sortBy: 'top',
        speaking: params.speaking,
        learning: params.learning
      })
  })
}
