import { Component, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { ApiService } from '../../../services/api-service'
import { LearnablesStore } from '../../../store/learnables-store'
import { CardsQuickSelector } from '../../shared/cards-quick-selector/cards-quick-selector'
import { HeaderLink } from '../../shared/header-link/header-link'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { InfoCard } from '../../shared/info-card/info-card'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PracticeQuickActions } from '../../shared/practice-quick-actions/practice-quick-actions'
import { PageWrapper } from '../page-wrapper/page-wrapper'
import { SharedBankComp } from '../share-page-comp/shared-collection-comp/shared-bank-comp'

@Component({
  selector: 'app-dashboard-page',
  imports: [
    PageHeaderComp,
    HeaderLink,
    PracticeQuickActions,
    CardsQuickSelector,
    SharedBankComp,
    PageWrapper,
    IconComp,
    RouterLink,
    InfoCard
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage {
  private readonly apiS = inject(ApiService)
  private readonly ls = inject(LearnablesStore)

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
