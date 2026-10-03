import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router'
import { SettingsStore } from '../store/settings-store'

export const isNewUserGuard: CanActivateFn & CanActivateChildFn = (route, state) => {
  // if new user -> onboardin
  // there: if bank id, show loading, on error toast and normal onboardin
  // if no error: shared onboarding

  if (inject(SettingsStore).userID()) return true

  return inject(Router).createUrlTree(['onboarding'], { queryParams: route.queryParams })
}
