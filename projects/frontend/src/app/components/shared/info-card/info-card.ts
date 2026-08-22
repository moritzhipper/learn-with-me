import { booleanAttribute, Component, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixInformationFill } from '@ng-icons/remixicon'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'liz-info-card',
  imports: [IconComp, NgIcon],
  providers: [provideIcons({ remixInformationFill })],
  templateUrl: './info-card.html',
  styleUrl: './info-card.scss',
  host: {
    '[class]': 'type()',
    '[class.full-page]': 'fullPage()'
  }
})
export class InfoCard {
  type = input<'info' | 'warn'>('info')
  title = input<string>()
  fullPage = input(false, { transform: booleanAttribute })
}
