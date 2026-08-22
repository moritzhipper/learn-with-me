import { booleanAttribute, Component, input } from '@angular/core'
import { Params, RouterLink } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { collapseIcon } from '../../../icon-registry'

@Component({
  selector: 'app-header-link',
  templateUrl: './header-link.html',
  styleUrl: './header-link.scss',
  imports: [NgIcon, RouterLink]
})
export class HeaderLink {
  protected readonly collapseIcon = collapseIcon
  label = input.required<string>()
  route = input.required<string>()
  queryParams = input<Params>()

  eyebrow = input(false, { transform: booleanAttribute })
}
