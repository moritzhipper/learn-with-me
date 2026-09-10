import { Component, computed, inject, linkedSignal, output } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { PracticeActive } from '@shared/types'
import { collapseIcon } from '../../../../../icon-registry'
import { LearnablesStore } from '../../../../../store/learnables-store'

@Component({
  selector: 'liz-swiper-nav',
  imports: [NgIcon],
  templateUrl: './swiper-nav.html',
  styleUrl: './swiper-nav.scss'
})
export class SwiperNav {
  private ls = inject(LearnablesStore)
  protected collapseIcon = collapseIcon
  edit = output<void>()

  isOpen = linkedSignal<PracticeActive | null, boolean>({
    source: computed(() => this.ls.activeBank().practice.active),
    computation: () => false
  })

  giveUp() {
    this.ls.endPracticePrematurely()
  }
}
