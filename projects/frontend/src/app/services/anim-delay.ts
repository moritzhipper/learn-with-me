import { Directive, input } from '@angular/core'

type AnimConfig = { i: number; duration?: number } & ({ size: number } | { list: unknown[] })

@Directive({
  selector: '[animDelay]',
  host: {
    '[style.animationDelay.s]': 'animDelay()'
  }
})
export class AnimDelay {
  readonly animDelay = input.required<Number, AnimConfig>({
    transform: (conf) => this.mapToAnimDelay(conf)
  })

  private readonly DURATION_DEFAULT = 0.2
  // Ensures that the intervaall delay between items of small lists does not become to long, making the animation feel sluggish
  private readonly MAXIMUM_INTEVAL_DELAY = 0.03

  protected mapToAnimDelay(conf: AnimConfig): number {
    const size = 'size' in conf ? conf.size : conf.list.length
    const i = conf.i
    const duration = conf.duration ?? this.DURATION_DEFAULT
    const intervalDelay = Math.min(duration / size, this.MAXIMUM_INTEVAL_DELAY)

    return i * intervalDelay
  }
}
