import {
  booleanAttribute,
  Component,
  ElementRef,
  HostListener,
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
  protected readonly scrollProcess = signal(0)

  @HostListener('scroll', ['$event']) onScrollEvent(event: Event) {
    const target = event.target as HTMLElement
    const headerHeight = this.header()?.nativeElement.offsetHeight
    if (!headerHeight) return

    this.scrollProcess.set(Math.min(target.scrollTop, headerHeight) / headerHeight)
  }
}
