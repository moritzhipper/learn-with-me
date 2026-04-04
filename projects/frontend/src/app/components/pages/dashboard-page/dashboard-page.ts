import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

@Component({
  selector: 'app-dashboard-page',
  imports: [PageHeaderComp, PageIconComp, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  host: { class: 'page mid' }
})
export class DashboardPage {}
