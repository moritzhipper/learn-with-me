import { afterRenderEffect, contentChildren, Directive, ElementRef, input } from '@angular/core'
import { mapToAnimDelay } from './anim-delay-utils'

@Directive({
  selector: '[lizAnimDelayWrapper]'
})
export class AnimDelayWrapper {
  readonly useClass = input<string>()

  readonly content = contentChildren('animItem', {
    descendants: true,
    read: ElementRef
  })

  constructor() {
    afterRenderEffect(() => {
      const items = this.content()
      if (!items.length) return
      const size = items.length

      items.forEach((item, i) => {
        const delay = mapToAnimDelay({ i, size })

        item.nativeElement.classList.add(this.useClass())
        item.nativeElement.style.setProperty('animation-delay', `${delay}s`)
      })
    })
  }
}
