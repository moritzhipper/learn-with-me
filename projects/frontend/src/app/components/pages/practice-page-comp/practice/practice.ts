import { Component, computed, inject } from '@angular/core'
import { LearnablesStore } from '../../../../store/learnables-store'
import { SwiperNav } from './swiper-nav/swiper-nav'
import { SwiperSummary } from './swiper-summary/swiper-summary'
import { Swiper } from './swiper/swiper'

@Component({
  selector: 'liz-practice',
  imports: [Swiper, SwiperNav, SwiperSummary],
  templateUrl: './practice.html',
  styleUrl: './practice.scss'
})
export class Practice {
  private ls = inject(LearnablesStore)

  practice = computed(() => this.ls.activeBank().practice.active)

  isOngoing = computed(() => {
    const practice = this.practice()
    if (!practice) return
    return practice.guessableIndex - 1 === practice.guessables.length
  })
}
