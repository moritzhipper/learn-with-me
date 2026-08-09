import { Component, input } from '@angular/core'
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
}
