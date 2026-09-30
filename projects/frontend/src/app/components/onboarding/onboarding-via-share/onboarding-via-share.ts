import { Component, computed, input, signal } from '@angular/core'
import { BankShareViaDB } from '@shared/types'
import { buildDebugBank } from '../../../services/debug-helper/debug-utils'
import { SwiperPageLayout } from '../../pages/practice-page-comp/practice/swiper-page-layout/swiper-page-layout'
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
  imports: [OnboardingNav, SwiperPageLayout],
  templateUrl: './onboarding-via-share.html',
  styleUrl: './onboarding-via-share.scss'
})
export class OnboardingViaShare {
  readonly page = signal<number>(0)

  sharedBank = input<BankShareViaDB>(sharedBank)

  randomWords = computed(() => {})
}
