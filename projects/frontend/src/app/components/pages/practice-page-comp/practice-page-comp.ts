import { Component, computed, effect, inject } from '@angular/core'
import { practicePageIcon } from '../../../icon-registry'
import { LearnablesStore } from '../../../store/learnables-store'
import { PageWrapper } from '../page-wrapper/page-wrapper'
import { ConfigurePracticeComp } from './configure-practice-comp/configure-practice-comp'
import { SwiperNav } from './practice/swiper-nav/swiper-nav'
import { SwiperSummary } from './practice/swiper-summary/swiper-summary'
import { Swiper } from './practice/swiper/swiper'
import { SwiperPageLayout } from './swiper-page-layout/swiper-page-layout'

@Component({
  selector: 'app-practice',
  imports: [ConfigurePracticeComp, PageWrapper, SwiperSummary, SwiperNav, Swiper, SwiperPageLayout],
  templateUrl: './practice-page-comp.html',
  styleUrl: './practice-page-comp.scss'
})
export class PracticeComp {
  protected readonly ls = inject(LearnablesStore)
  currentPractice = computed(() => this.ls.activeBank().practice.active)

  protected readonly practiceIcon = practicePageIcon
  constructor() {
    effect(() => {
      console.log({
        isOngoing: this.isOngoing(),
        practice: this.currentPractice()
      })
    })
  }

  protected isOngoing = computed(() => {
    const practice = this.currentPractice()
    if (!practice) return false

    return practice.guessableIndex < practice.guessables.length
  })

  finish() {
    this.ls.resetPracticeAndSaveToHistory()
  }
}
