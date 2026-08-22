import { Component } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { remixInformationFill } from '@ng-icons/remixicon'
import { config } from '../../../../config'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageWrapper } from '../page-wrapper/page-wrapper'

@Component({
  selector: 'app-about-page-comp',
  imports: [PageHeaderComp, PageWrapper],
  templateUrl: './about-page-comp.html',
  styleUrl: './about-page-comp.scss',
  providers: [
    provideIcons({
      remixInformationFill
    })
  ]
})
export class AboutPageComp {
  appName = config.appNameLong

  infoIcon = remixInformationFill
}
