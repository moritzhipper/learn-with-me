import { Component, input } from '@angular/core'
import { IconType, NgIcon } from '@ng-icons/core'

@Component({
  selector: 'app-page-icon-comp',
  imports: [NgIcon],
  templateUrl: './page-icon-comp.html',
  styleUrl: './page-icon-comp.scss'
})
export class PageIconComp {
  type = input.required<IconType>()
}
