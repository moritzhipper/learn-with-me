import { afterNextRender, Directive, ElementRef, inject, input } from '@angular/core'
import { mapToAnimDelay } from './anim-delay-utils'

@Directive({
  selector: '[lizAnimDelayWrapper]'
})
export class AnimDelayWrapper {
  private readonly defaultSelector = '[animItem]'
  /**
   * Applies animation delay to children matching this element selector
   */
  readonly selectors = input<string>(this.defaultSelector)

  /**
   * Applies class to every child with #animItem template ref
   */
  readonly applyClass = input<string>()

  private readonly hostEl: ElementRef<HTMLElement> = inject(ElementRef)

  constructor() {
    afterNextRender(() => {
      const items: NodeListOf<HTMLElement> = this.hostEl.nativeElement.querySelectorAll(
        this.selectors()
      )

      items.forEach((item, i) => {
        const delay = mapToAnimDelay({ i, size: items.length })
        const applyClass = this.applyClass()

        if (applyClass) {
          item.classList.add(applyClass)
        }

        item.style.setProperty('animation-delay', `${delay}s`)
      })
    })
  }
}
