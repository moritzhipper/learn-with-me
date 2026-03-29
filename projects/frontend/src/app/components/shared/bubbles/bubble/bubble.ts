import { Component, input, output } from '@angular/core'
import { IconComp } from '../../icon-comp/icon-comp'

export type BubbleConfig =
  | 'magic'
  | 'translate'
  | 'remove'
  | 'bulk-edit'
  | 'import'
  | 'move'
  | 'trash'
  | 'reset-selection'

@Component({
  selector: 'app-bubble',
  imports: [IconComp],
  templateUrl: './bubble.html',
  styleUrl: './bubble.scss'
})
export class Bubble {
  config = input.required<BubbleConfig>()
  size = input<'big' | 'small'>('small')
  select = output<void>()
}
