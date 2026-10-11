import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router'
import z from 'zod'
import { SettingsStore } from '../store/settings-store'

const extractBankID = (state: RouterStateSnapshot): string | null => {
  const segments = state.url.split('/')
  const bankSegmentIndex = segments.indexOf('bank')
  if (bankSegmentIndex === -1) return null

  const bankID = segments.at(bankSegmentIndex + 1)
  if (!bankID) return null
  const idResult = z.uuid().safeParse(bankID)

  if (!idResult.success) return null
  return idResult.data
}

const isOnboardedGuardFactory =
  (prohibitOnboardedUsers: boolean): CanActivateFn & CanActivateChildFn =>
  (route, state) => {
    const router = inject(Router)
    const sStore = inject(SettingsStore)
    const isOnboarded = !!sStore.userID()

    if (isOnboarded === prohibitOnboardedUsers) return true
    if (!prohibitOnboardedUsers) return router.createUrlTree(['/'])

    const onboardingBankID = extractBankID(state)

    sStore.updateSettings({ onboardingBankID })

    return router.createUrlTree(['onboarding'])
  }

export const onboardedGuard = {
  is: isOnboardedGuardFactory(true),
  isNot: isOnboardedGuardFactory(false)
}
