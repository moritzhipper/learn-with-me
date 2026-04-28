import { Component, computed, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { ApiService } from '../../../services/api-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { CardsQuickSelector } from '../../shared/cards-quick-selector/cards-quick-selector'
import { HeaderLink } from '../../shared/header-link/header-link'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { PracticeQuickActions } from '../../shared/practice-quick-actions/practice-quick-actions'
import { SharedBankComp } from '../share-page-comp/shared-collection-comp/shared-bank-comp'

@Component({
  selector: 'app-dashboard-page',
  imports: [
    PageHeaderComp,
    PageIconComp,
    HeaderLink,
    PracticeQuickActions,
    CardsQuickSelector,
    SharedBankComp
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  host: { class: 'page mid' }
})
export class DashboardPage {
  private readonly apiS = inject(ApiService)
  private readonly ls = inject(LearnablesStore)

  sharedBanks = rxResource({
    params: computed(() => this.ls.activeBank().language),
    stream: ({ params }) =>
      this.apiS.getCommunityBanks({
        limit: 6,
        sortBy: 'top',
        speaking: params.speaking,
        learning: params.learning
      })
  })
}
