import { computed, Directive, input } from '@angular/core'

type AnimConfig = { i: number; duration?: number } & ({ size: number } | { list: unknown[] })

@Directive({
  selector: '[animDelay]',
  host: {
    '[style.animationDelay.s]': 'animationDelay()'
  }
})
export class AnimDelay {
  readonly animDelay = input.required<AnimConfig>()
  private readonly DURATION_DEFAULT = 0.3

  protected readonly animationDelay = computed(() => {
    const conf = this.animDelay()
    const size = 'size' in conf ? conf.size : conf.list.length
    const i = conf.i
    const duration = conf.duration ?? this.DURATION_DEFAULT

    return i * (duration / size)
  })
}
