import { booleanAttribute, Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { aboutPageIcon, warningIcon } from '../../../icon-registry'

@Component({
  selector: 'liz-info-card',
  imports: [NgIcon],
  templateUrl: './info-card.html',
  styleUrl: './info-card.scss',
  host: {
    '[class]': 'type()',
    '[class.full-page]': 'fullPage()'
  }
})
export class InfoCard {
  protected readonly icons = {
    aboutPageIcon,
    warningIcon
  }
  type = input<'info' | 'warn'>('info')
  title = input<string>()
  fullPage = input(false, { transform: booleanAttribute })
}
