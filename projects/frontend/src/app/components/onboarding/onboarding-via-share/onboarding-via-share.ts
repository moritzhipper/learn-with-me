import { Component, computed, input } from '@angular/core'
import { BankShareViaDB } from '@shared/types'
import { buildDebugBank } from '../../../services/debug-helper/debug-utils'

const sharedBank: BankShareViaDB = {
  ...buildDebugBank(),
  createdAt: new Date(),
  expires: new Date(),
  isCommunityBank: true,
  downloads: 10
}

@Component({
  selector: 'liz-onboarding-via-share',
  imports: [],
  templateUrl: './onboarding-via-share.html',
  styleUrl: './onboarding-via-share.scss'
})
export class OnboardingViaShare {
  readonly page = input<number>(0)

  sharedBank = input<BankShareViaDB>(sharedBank)

  randomWords = computed(() => {})
}
