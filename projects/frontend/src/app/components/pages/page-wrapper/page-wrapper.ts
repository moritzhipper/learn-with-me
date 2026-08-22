import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  ElementRef,
  input,
  signal,
  viewChild
} from '@angular/core'
import { IconType, NgIcon } from '@ng-icons/core'

@Component({
  selector: 'app-page-wrapper',
  imports: [NgIcon],
  templateUrl: './page-wrapper.html',
  styleUrl: './page-wrapper.scss',
  host: {
    '[class.full-screen]': 'fullScreen()'
  }
})
export class PageWrapper {
  readonly icon = input<IconType>()
  readonly fullScreen = input(false, { transform: booleanAttribute })

  private header = viewChild<ElementRef>('header')
  protected headerHeight = signal<number>(150)

  constructor() {
    afterRenderEffect(() => {
      const height = this.header()?.nativeElement.offsetHeight
      if (!height) return

      this.headerHeight.set(height)
    })
  }
}
