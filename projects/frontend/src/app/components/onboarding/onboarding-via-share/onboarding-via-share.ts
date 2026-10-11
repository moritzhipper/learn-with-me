import { Component, computed, inject, input } from '@angular/core'
import { Router } from '@angular/router'
import { BankShareViaDB } from '@shared/types'
import { AnimDelayWrapper } from '../../../directives/anim-delay-wrapper'
import { LearnablesStore } from '../../../store/learnables-store'
import { SettingsStore } from '../../../store/settings-store'
import { SwiperPageLayout } from '../../pages/practice-page-comp/practice/swiper-page-layout/swiper-page-layout'
import { LarryBig } from '../../shared/larries/larry-big/larry-big'
import { OnboardingNav } from '../onboarding-nav/onboarding-nav'

@Component({
  selector: 'liz-onboarding-via-share',
  imports: [OnboardingNav, SwiperPageLayout, LarryBig, AnimDelayWrapper],
  templateUrl: './onboarding-via-share.html',
  styleUrl: './onboarding-via-share.scss'
})
export class OnboardingViaShare {
  private readonly ls = inject(LearnablesStore)
  private readonly settingsS = inject(SettingsStore)
  private readonly router = inject(Router)

  readonly sharedBank = input.required<BankShareViaDB>()
  protected randomLearnables = computed(() => this.sharedBank().learnables.slice(0, 3))

  protected openBank() {
    this.settingsS.updateSettings({ userID: crypto.randomUUID() })
    const newID = this.ls.importBankAsNew(this.sharedBank())

    this.ls.setActiveBank(newID)
    this.router.navigate(['cards', newID])
  }
}
