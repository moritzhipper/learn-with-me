import { Component, computed, inject } from '@angular/core'
import { UserLearnable } from '@shared/types'
import { practicePageIcon } from '../../../icon-registry'
import { ModalService } from '../../../services/modal-service'
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
  private readonly modals = inject(ModalService)
  currentPractice = computed(() => this.ls.activeBank().practice.active)

  protected readonly practiceIcon = practicePageIcon

  finish() {
    this.ls.resetPracticeAndSaveToHistory()
  }

  giveUp() {
    this.ls.endPracticePrematurely()
  }

  async editActiveLearnable() {
    const practice = this.ls.activeBank().practice.active
    if (!practice) return

    const activeLearnableId = practice.guessables[practice.guessableIndex]?.id
    if (!activeLearnableId) return

    const learnable = this.ls.activeBank().learnables.find((c) => c.id === activeLearnableId)
    if (!learnable) return

    const res = await this.modals.open<UserLearnable>('single-edit', { learnable })

    if (res.type === 'cancel') return
    this.ls.updateCards([
      {
        ...res.value,
        id: learnable.id
      }
    ])
  }
}
