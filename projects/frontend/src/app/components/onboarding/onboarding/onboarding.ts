import { Component, inject, input } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { BankShareViaDB } from '@shared/types'
import { ApiService } from '../../../services/api-service'
import { buildDebugBank } from '../../../services/debug-helper/debug-utils'
import { ToastService } from '../../../services/toast-service'
import { PageWrapper } from '../../pages/page-wrapper/page-wrapper'
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner'
import { OnboardingClean } from '../onboarding-clean/onboarding-clean'
import { OnboardingViaShare } from '../onboarding-via-share/onboarding-via-share'

const sharedBank: BankShareViaDB = {
  ...buildDebugBank(),
  createdAt: new Date(),
  expires: new Date(),
  isCommunityBank: true,
  downloads: 10
}

@Component({
  selector: 'liz-onboarding',
  imports: [PageWrapper, OnboardingViaShare, OnboardingClean, LoadingSpinner],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  readonly bankID = input<string>()
  readonly api = inject(ApiService)

  readonly toastS = inject(ToastService)

  sharedBank = rxResource({
    params: this.bankID,
    stream: ({ params }) => this.api.getBankByID(params).pipe(this.toastS.pipeError()),
    defaultValue: sharedBank
  })
}
