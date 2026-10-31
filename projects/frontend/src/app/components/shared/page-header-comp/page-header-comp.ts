import { Component, computed, input } from '@angular/core'
import { HeaderLink } from '../header-link/header-link'

@Component({
  selector: 'app-page-header-comp',
  imports: [HeaderLink],
  templateUrl: './page-header-comp.html',
  styleUrl: './page-header-comp.scss'
})
export class PageHeaderComp {
  title = input.required<string>()
  backLink = input<string | null>(null)
  backLinkText = input<string | null>(null)

  protected textSize = computed<'big' | 'medium' | 'small'>(() => {
    const { length } = this.title()
    if (length < 8) return 'big'
    if (length < 25) return 'medium'
    return 'small'
  })
}
