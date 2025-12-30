import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-page-header-comp',
  imports: [RouterLink, IconComp],
  templateUrl: './page-header-comp.html',
  styleUrl: './page-header-comp.scss'
})
export class PageHeaderComp {
  title = input.required<string>()
  backLink = input<string | null>(null)
  backLinkText = input<string | null>(null)
}
