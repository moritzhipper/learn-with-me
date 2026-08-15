import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { modalOpenGuard } from './modal-open-guard'

describe('modalOpenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => modalOpenGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
