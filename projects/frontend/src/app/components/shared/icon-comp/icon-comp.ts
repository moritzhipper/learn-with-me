import { booleanAttribute, Component, input } from '@angular/core'

export type IconType =
  | 'settings'
  | 'chevron'
  | 'card'
  | 'learn'
  | 'magic'
  | 'menu'
  | 'pen'
  | 'ai-pen'
  | 'trash'
  | 'edit'
  | 'add-fill'
  | 'add'
  | 'collection'
  | 'collection-add'
  | 'collection-remove'
  | 'share'
  | 'share-network'
  | 'share-network-fill'
  | 'import'
  | 'warn'
  | 'info'
  | 'copy'
  | 'left-right'
  | 'heart'
  | 'star'
  | 'star-fill'
  | 'meteor'
  | 'wrong-guess'
  | 'right-guess'
  | 'chevron-right'
  | 'close'
  | 'image'
  | 'translate'
  | 'dashboard'
  | 'donut-chart-fill'
  | 'drop'
  | 'drop-fill'
  | 'checkbox-multiple'
  | 'calendar'
  | 'up-arrow'
  | 'gear'
  | 'speed'
  | 'speaking'
  | 'understand'
  | 'arrow-right'
  | 'checkbox-multiple-blank-line'

@Component({
  selector: 'app-icon-comp',
  imports: [],
  templateUrl: './icon-comp.html',
  styleUrl: './icon-comp.scss',
  host: {
    '[style.--dimension]': 'size() === "auto" ? "auto" : `${size()}px`',
    '[class.inline]': 'inline()'
  }
})
export class IconComp {
  type = input.required<IconType>()
  size = input<number | 'auto'>(24)
  inline = input(false, { transform: booleanAttribute })
}
