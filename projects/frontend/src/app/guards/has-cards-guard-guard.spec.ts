import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { hasCardsGuardGuard } from './has-cards-guard'

describe('hasCardsGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasCardsGuardGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
