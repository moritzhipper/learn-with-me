import { booleanAttribute, Component, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixErrorWarningFill, remixInformationFill } from '@ng-icons/remixicon'

@Component({
  selector: 'liz-info-card',
  imports: [NgIcon],
  providers: [provideIcons({ remixErrorWarningFill, remixInformationFill })],
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
