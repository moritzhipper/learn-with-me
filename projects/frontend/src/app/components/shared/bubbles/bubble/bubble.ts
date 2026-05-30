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
  | 'checkbox-multiple'

@Component({
  selector: 'app-bubble',
  imports: [IconComp],
  templateUrl: './bubble.html',
  styleUrl: './bubble.scss',
  host: {
    '[animate.enter]': '`fly-in-bubble-${animateIndex()}`',
    '[animate.leave]': '`fly-out-bubble-${animateIndex()}`'
  }
})
export class Bubble {
  config = input.required<BubbleConfig>()
  size = input<'big' | 'medium' | 'small'>('small')
  select = output<void>()
  animateIndex = input<number>(0)
}
