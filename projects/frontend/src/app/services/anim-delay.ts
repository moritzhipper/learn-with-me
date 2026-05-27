import { computed, Directive, input } from '@angular/core'
import { staggerDelays } from '../utils/genaral-utils'

type AnimConfig = { i: number; duration?: number } & ({ size: number } | { list: unknown[] })
@Directive({
  selector: '[animDelay]',
  host: {
    '[style.animationDelay.s]': 'animationDelay()'
  }
})
export class AnimDelay {
  readonly animDelay = input.required<AnimConfig>()

  protected readonly animationDelay = computed(() => {
    const config = this.animDelay()
    const size = 'size' in config ? config.size : config.list.length

    return staggerDelays(size, config.duration)[config.i]
  })
}
