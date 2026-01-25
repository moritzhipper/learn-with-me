import { Component } from '@angular/core'
import { config } from 'projects/frontend/src/config'
import { LarryBig } from '../../shared/larries/larry-big/larry-big'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

@Component({
  selector: 'app-about-page-comp',
  imports: [PageHeaderComp, PageIconComp, LarryBig],
  templateUrl: './about-page-comp.html',
  styleUrl: './about-page-comp.scss',
  host: {
    class: 'page mid'
  }
})
export class AboutPageComp {
  appName = config.appNameLong
}
