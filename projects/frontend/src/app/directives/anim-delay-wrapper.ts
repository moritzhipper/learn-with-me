import { afterRenderEffect, contentChildren, Directive, ElementRef } from '@angular/core'
import { mapToAnimDelay } from './anim-delay-utils'

@Directive({
  selector: '[lizAnimDelayWrapper]'
})
export class AnimDelayWrapper {
  content = contentChildren('animItem', { descendants: true, read: ElementRef<HTMLElement> })

  constructor() {
    afterRenderEffect(() => {
      const items = this.content()
      if (!items.length) return
      const size = items.length

      items.forEach((item, i) => {
        const delay = mapToAnimDelay({ i, size })
        item.nativeElement.style.setProperty('animation-delay', `${delay}s`)
      })
    })
  }
}
