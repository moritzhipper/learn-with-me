import { Location } from '@angular/common'
import { booleanAttribute, Component, inject, input } from '@angular/core'
import { IconComp } from '../../icon-comp/icon-comp'

@Component({
  selector: 'liz-page-header-cards',
  imports: [IconComp],
  templateUrl: './page-header-cards.html',
  styleUrl: './page-header-cards.scss',
  host: {
    '[class.outline]': 'outline()'
  }
})
export class PageHeaderCards {
  outline = input(false, { transform: booleanAttribute })
  title = input.required<string>()

  private readonly location = inject(Location)

  browserBack() {
    this.location.back()
  }
}
