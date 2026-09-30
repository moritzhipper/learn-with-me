import { Component, signal } from '@angular/core'
import { SwiperPageLayout } from '../../pages/practice-page-comp/practice/swiper-page-layout/swiper-page-layout'
import { OnboardingNav } from '../onboarding-nav/onboarding-nav'

@Component({
  selector: 'liz-onboarding-clean',
  imports: [SwiperPageLayout, OnboardingNav],
  templateUrl: './onboarding-clean.html',
  styleUrl: './onboarding-clean.scss'
})
export class OnboardingClean {
  readonly page = signal<number>(0)
}
