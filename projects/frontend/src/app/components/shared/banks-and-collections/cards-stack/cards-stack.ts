import { booleanAttribute, Component, input } from '@angular/core'

@Component({
  selector: '[liz-cards-stack], liz-cards-stack',
  imports: [],
  templateUrl: './cards-stack.html',
  styleUrl: './cards-stack.scss',
  host: {
    '[class.outline]': 'outline()'
  }
})
export class CardsStack {
  outline = input(false, { transform: booleanAttribute })
}
