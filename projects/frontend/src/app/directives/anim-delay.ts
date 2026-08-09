import { Directive, input } from '@angular/core'
import { AnimConfig, mapToAnimDelay } from './anim-delay-utils'

@Directive({
  selector: '[animDelay]',
  host: {
    '[style.animationDelay.s]': 'animDelay()'
  }
})
export class AnimDelay {
  readonly animDelay = input.required<Number, AnimConfig>({
    transform: (conf) => mapToAnimDelay(conf)
  })
}
