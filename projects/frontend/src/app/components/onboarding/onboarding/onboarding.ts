import { Component, signal } from '@angular/core'
import { PageWrapper } from '../../pages/page-wrapper/page-wrapper'
import { OnboardingClean } from '../onboarding-clean/onboarding-clean'
import { OnboardingViaShare } from '../onboarding-via-share/onboarding-via-share'

@Component({
  selector: 'liz-onboarding',
  imports: [PageWrapper, OnboardingViaShare, OnboardingClean],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  private pageCount = 2

  userCameViaBankShare = signal(true)
}
