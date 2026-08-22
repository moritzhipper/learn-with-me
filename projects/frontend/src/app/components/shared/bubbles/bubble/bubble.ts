import { Component, input, output } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import {
  addToCollectionIcon,
  editIcon,
  magicIcon,
  multiSelectIcon,
  removeFromCollectionIcon,
  removeIcon,
  translatePageIcon
} from '../../../../icon-registry'

export type BubbleConfig =
  'magic' | 'translate' | 'remove' | 'bulk-edit' | 'move' | 'trash' | 'checkbox-multiple'

@Component({
  selector: 'app-bubble',
  imports: [NgIcon],
  templateUrl: './bubble.html',
  styleUrl: './bubble.scss',
  host: {
    '[animate.enter]': '`fly-in-bubble-${animateIndex()}`',
    '[animate.leave]': '`fly-out-bubble-${animateIndex()}`'
  }
})
export class Bubble {
  protected readonly icons = {
    addToCollectionIcon,
    editIcon,
    magicIcon,
    multiSelectIcon,
    removeFromCollectionIcon,
    translatePageIcon,
    removeIcon
  }
  config = input.required<BubbleConfig>()
  size = input<'big' | 'medium' | 'small'>('small')
  select = output<void>()
  animateIndex = input<number>(0)
  count = input<number>(0)
}
