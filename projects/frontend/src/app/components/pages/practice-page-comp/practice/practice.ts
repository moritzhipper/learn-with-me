import { Component, computed, inject } from '@angular/core'
import { LearnablesStore } from '../../../../store/learnables-store'
import { SwiperNav } from './swiper-nav/swiper-nav'
import { SwiperSummary } from './swiper-summary/swiper-summary'

@Component({
  selector: 'liz-practice',
  imports: [SwiperNav, SwiperSummary],
  templateUrl: './practice.html',
  styleUrl: './practice.scss'
})
export class Practice {
  private ls = inject(LearnablesStore)

  practice = computed(() => this.ls.activeBank().practice.active)

  protected isOngoing = computed(() => {
    const practice = this.practice()
    if (!practice) return false
    return practice.guessableIndex < practice.guessables.length
  })

  finish() {
    this.ls.resetPracticeAndSaveToHistory()
  }
}
