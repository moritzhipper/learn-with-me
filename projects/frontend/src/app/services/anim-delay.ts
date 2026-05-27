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
  private readonly DURATION_DEFAULT = 0.3

  protected mapToAnimDelay(conf: AnimConfig): number {
    const size = 'size' in conf ? conf.size : conf.list.length
    const i = conf.i
    const duration = conf.duration ?? this.DURATION_DEFAULT

    return i * (duration / size)
  }
}
