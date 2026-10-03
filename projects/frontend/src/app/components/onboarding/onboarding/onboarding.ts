import { Component, inject, input, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { ApiService } from '../../../services/api-service'
import { PageWrapper } from '../../pages/page-wrapper/page-wrapper'
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner'
import { OnboardingClean } from '../onboarding-clean/onboarding-clean'
import { OnboardingViaShare } from '../onboarding-via-share/onboarding-via-share'

@Component({
  selector: 'liz-onboarding',
  imports: [PageWrapper, OnboardingViaShare, OnboardingClean, LoadingSpinner],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  readonly bankID = input<string>()
  readonly api = inject(ApiService)

  sharedBank = rxResource({
    params: this.bankID,
    stream: ({ params }) => this.api.getBankByID(params)
  })

  userCameViaBankShare = signal(true)
}
