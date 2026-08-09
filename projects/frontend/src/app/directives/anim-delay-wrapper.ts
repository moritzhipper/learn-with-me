import { afterRenderEffect, contentChildren, Directive, ElementRef, input } from '@angular/core'

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
      const size = items.length

      items.forEach((item, i) => {
        const delay = this.mapToDelay(i, size, duration)
        item.style.setProperty('animation-delay', `${delay}s`)

        const applyClass = this.applyClass()
        if (applyClass) {
          item.classList.add(applyClass)
        }
      })
    })
  }

  private mapToDelay(i: number, size: number, duration: number) {
    const intervalDelay = duration / size
    return i * intervalDelay
  }
}
