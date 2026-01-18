import { Component, input } from '@angular/core'

@Component({
  selector: 'app-page-placeholder-comp',
  imports: [],
  templateUrl: './page-placeholder-comp.html',
  styleUrl: './page-placeholder-comp.scss'
})
export class PagePlaceholderComp {
  title = input.required()
}
