import { Component, computed, input } from '@angular/core'
import { BankShareViaDB } from '@shared/types'
import { buildDebugBank } from '../../../services/debug-helper/debug-utils'
import { SwiperPageLayout } from '../../pages/practice-page-comp/practice/swiper-page-layout/swiper-page-layout'
import { LarryBig } from '../../shared/larries/larry-big/larry-big'
import { OnboardingNav } from '../onboarding-nav/onboarding-nav'

const sharedBank: BankShareViaDB = {
  ...buildDebugBank(),
  createdAt: new Date(),
  expires: new Date(),
  isCommunityBank: true,
  downloads: 10
}

@Component({
  selector: 'liz-onboarding-via-share',
  imports: [OnboardingNav, SwiperPageLayout, LarryBig],
  templateUrl: './onboarding-via-share.html',
  styleUrl: './onboarding-via-share.scss'
})
export class OnboardingViaShare {
  readonly sharedBank = input<BankShareViaDB>(sharedBank)

  randomLearnables = computed(() => this.sharedBank().learnables.slice(0, 3))
}
