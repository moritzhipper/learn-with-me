import { Location } from '@angular/common'
import { booleanAttribute, Component, inject, input } from '@angular/core'
import { Router } from '@angular/router'
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
  private readonly router = inject(Router)

  /**
   * If opened via this URL, go to dashboard
   * If in app nav, go back
   */
  protected browserBack() {
    const state = this.location.getState()
    const hasId = typeof state === 'object' && state !== null && 'navigationId' in state

    if (hasId && state.navigationId && state.navigationId === 1) {
      this.router.navigate([''])
    } else {
      this.location.back()
    }
  }
}
