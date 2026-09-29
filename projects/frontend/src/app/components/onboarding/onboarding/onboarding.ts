import { Component, signal } from '@angular/core'
import { PageWrapper } from '../../pages/page-wrapper/page-wrapper'
import { SwiperPageLayout } from '../../pages/practice-page-comp/practice/swiper-page-layout/swiper-page-layout'
import { OnboardingClean } from '../onboarding-clean/onboarding-clean'
import { OnboardingViaShare } from '../onboarding-via-share/onboarding-via-share'

@Component({
  selector: 'liz-onboarding',
  imports: [SwiperPageLayout, PageWrapper, OnboardingViaShare, OnboardingClean],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  private pageCount = 2
  protected page = signal<number>(0)

  userCameViaBankShare = signal(true)

  next() {
    const page = this.page()

    if (page < this.pageCount - 1) {
      this.page.set(page + 1)
    } else if (page === this.pageCount - 1) {
      console.log('redirect here')
    }
  }
  prev() {
    const page = this.page()

    if (page > 0) {
      this.page.set(page - 1)
    }
  }
}
