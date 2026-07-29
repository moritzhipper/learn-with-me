import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router'
import { LearnablesStore } from '../store/learnables-store'

export const hasCardsGuard: CanActivateFn & CanActivateChildFn = (route, state) => {
  const ls = inject(LearnablesStore)
  const router = inject(Router)
  const hasCards = ls.learnables().length > 0
  if (hasCards) return true

  return router.parseUrl('/cards')
}
