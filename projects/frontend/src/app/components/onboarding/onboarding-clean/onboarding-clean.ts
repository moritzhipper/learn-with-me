import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { learnLanguageIcon, speakLanguageIcon } from '../../../icon-registry'
import { SwiperPageLayout } from '../../pages/practice-page-comp/practice/swiper-page-layout/swiper-page-layout'
import { OnboardingNav } from '../onboarding-nav/onboarding-nav'

@Component({
  selector: 'liz-onboarding-clean',
  imports: [SwiperPageLayout, OnboardingNav, NgIcon],
  templateUrl: './onboarding-clean.html',
  styleUrl: './onboarding-clean.scss'
})
export class OnboardingClean {
  private readonly router = inject(Router)

  icons = {
    speakLanguageIcon,
    learnLanguageIcon
  }

  protected goToDashboard() {
    this.router.navigate([''])
  }
}
