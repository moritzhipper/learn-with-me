import { Component } from '@angular/core'
import { CardsQuickSelector } from '../../shared/cards-quick-selector/cards-quick-selector'
import { HeaderLink } from '../../shared/header-link/header-link'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { PracticeQuickActions } from '../../shared/practice-quick-actions/practice-quick-actions'

@Component({
  selector: 'app-dashboard-page',
  imports: [PageHeaderComp, PageIconComp, HeaderLink, PracticeQuickActions, CardsQuickSelector],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  host: { class: 'page mid' }
})
export class DashboardPage {}
