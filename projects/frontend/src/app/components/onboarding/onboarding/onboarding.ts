import { Component, computed, effect, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { BankShareViaDB } from '@shared/types'
import { ApiService } from '../../../services/api-service'
import { buildDebugBank } from '../../../services/debug-helper/debug-utils'
import { ToastService } from '../../../services/toast-service'
import { SettingsStore } from '../../../store/settings-store'
import { PageWrapper } from '../../pages/page-wrapper/page-wrapper'
import { LarryBig } from '../../shared/larries/larry-big/larry-big'
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
  imports: [PageWrapper, OnboardingViaShare, OnboardingClean, LoadingSpinner, LarryBig],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  readonly sStore = inject(SettingsStore)
  readonly api = inject(ApiService)

  readonly toastS = inject(ToastService)
  constructor() {
    effect(() => {
      console.log(this.sStore.onboardingBankID())
    })
  }

  sharedBank = rxResource({
    params: computed(() => {
      const id = this.sStore.onboardingBankID()
      if (!id) return
      return id
    }),
    stream: ({ params }) =>
      this.api
        .getBankByID(params)
        .pipe(
          this.toastS.pipeError('The bank that was shared with you may not be available anymore')
        )
  })
}
