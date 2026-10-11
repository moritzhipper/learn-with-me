import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router'
import { SettingsStore } from '../store/settings-store'

export const isNewUserGuard: CanActivateFn & CanActivateChildFn = (route, state) => {
  if (inject(SettingsStore).userID()) return true

  return inject(Router).createUrlTree(['onboarding'], { queryParams: route.queryParams })
}
