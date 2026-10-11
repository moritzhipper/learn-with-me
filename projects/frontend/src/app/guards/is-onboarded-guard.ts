import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router'
import { SettingsStore } from '../store/settings-store'

const isOnboardedGuardFactory =
  (prohibitOnboardedUsers: boolean): CanActivateFn & CanActivateChildFn =>
  (route, state) => {
    const isOnboarded = !!inject(SettingsStore).userID()
    const router = inject(Router)
    if (isOnboarded === prohibitOnboardedUsers) return true

    if (prohibitOnboardedUsers) {
      return router.createUrlTree(['onboarding'], { queryParams: route.queryParams })
    }
    return router.createUrlTree(['/'])
  }

export const onboardedGuard = {
  is: isOnboardedGuardFactory(true),
  isNot: isOnboardedGuardFactory(false)
}
