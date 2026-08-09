import { afterRenderEffect, contentChildren, Directive, ElementRef, input } from '@angular/core'
import { mapToAnimDelay } from './anim-delay-utils'

@Directive({
  selector: '[lizAnimDelayWrapper]'
})
export class AnimDelayWrapper {
  readonly items = contentChildren<unknown, ElementRef<HTMLElement>>('animItem', {
    descendants: true,
    read: ElementRef
  })

  /**
   * Applies class to every child with #animItem template ref
   */
  readonly applyClass = input<string>()

  readonly duration = input<number>(0.2)

  constructor() {
    afterRenderEffect(() => {
      const items = this.items().map((item) => item.nativeElement)
      const duration = this.duration()

      items.forEach((item, i) => {
        const delay = mapToAnimDelay({ i, size: items.length, duration })
        const applyClass = this.applyClass()

        if (applyClass) {
          item.classList.add(applyClass)
        }

        item.style.setProperty('animation-delay', `${delay}s`)
      })
    })
  }
}
