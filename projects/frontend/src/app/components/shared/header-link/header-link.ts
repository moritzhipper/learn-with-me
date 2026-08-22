import { booleanAttribute, Component, input } from '@angular/core'
import { Params, RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixArrowDownSLine } from '@ng-icons/remixicon'

@Component({
  selector: 'app-header-link',
  templateUrl: './header-link.html',
  styleUrl: './header-link.scss',
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ remixArrowDownSLine })]
})
export class HeaderLink {
  label = input.required<string>()
  route = input.required<string>()
  queryParams = input<Params>()

  eyebrow = input(false, { transform: booleanAttribute })
}
