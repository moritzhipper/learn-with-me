import { Component } from '@angular/core'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

@Component({
  selector: 'app-stats-page',
  imports: [PageHeaderComp, PageIconComp],
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.scss'
})
export class StatsPage {}
