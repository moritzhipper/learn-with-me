import { booleanAttribute, Component, input } from '@angular/core'
import { HeaderLink } from '../../header-link/header-link'

@Component({
  selector: 'liz-page-header-cards',
  imports: [HeaderLink],
  templateUrl: './page-header-cards.html',
  styleUrl: './page-header-cards.scss',
  host: {
    '[class.outline]': 'outline()'
  }
})
export class PageHeaderCards {
  outline = input(false, { transform: booleanAttribute })
}
