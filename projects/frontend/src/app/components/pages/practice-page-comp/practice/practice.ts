import { Component, computed, inject } from '@angular/core'
import { LearnablesStore } from '../../../../store/learnables-store'
import { SwiperPageLayout } from '../swiper-page-layout/swiper-page-layout'
import { SwiperNav } from './swiper-nav/swiper-nav'
import { SwiperSummary } from './swiper-summary/swiper-summary'
import { Swiper } from './swiper/swiper'

@Component({
  selector: 'liz-practice',
  imports: [SwiperNav, SwiperSummary, Swiper, SwiperPageLayout],
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
