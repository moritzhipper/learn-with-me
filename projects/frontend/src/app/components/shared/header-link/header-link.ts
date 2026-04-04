import { Component, input } from '@angular/core'
import { Params, RouterLink } from '@angular/router'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-header-link',
  templateUrl: './header-link.html',
  styleUrl: './header-link.scss',
  imports: [IconComp, RouterLink]
})
export class HeaderLink {
  label = input.required<string>()
  route = input.required<string>()
  queryParams = input<Params>()
}
