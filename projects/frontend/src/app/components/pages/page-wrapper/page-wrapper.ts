import { booleanAttribute, Component, input } from '@angular/core'
import { IconType } from '../../shared/icon-comp/icon-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

@Component({
  selector: 'app-page-wrapper',
  imports: [PageIconComp],
  templateUrl: './page-wrapper.html',
  styleUrl: './page-wrapper.scss',
  host: {
    '[class.full-screen]': 'fullScreen()'
  }
})
export class PageWrapper {
  icon = input.required<IconType>()
  fullScreen = input(false, { transform: booleanAttribute })
}
