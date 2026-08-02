import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  ElementRef,
  input,
  signal,
  viewChild
} from '@angular/core'
import { IconType } from '../../shared/icon-comp/icon-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'

@Component({
  selector: 'app-page-wrapper',
  imports: [PageIconComp],
  templateUrl: './page-wrapper.html',
  styleUrl: './page-wrapper.scss',
  host: {
    '[class.full-screen]': 'fullScreen()'
  }
})
export class PageWrapper {
  readonly icon = input.required<IconType>()
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
