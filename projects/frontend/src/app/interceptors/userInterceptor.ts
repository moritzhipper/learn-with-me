import { HttpHandlerFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { SettingsStore } from '../store/settings-store'

export const userInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const userID = inject(SettingsStore).userID()

  return next(
    req.clone({
      headers: req.headers.set('X-User-ID', userID)
    })
  )
}
