import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn } from '@angular/router'
import { ModalService } from '../services/modal-service'

export const modalOpenGuard: CanActivateFn & CanActivateChildFn = () => {
  const modalService = inject(ModalService)
  if (modalService.currentlyOpenModalConfig()) {
    modalService.resolveModal({ type: 'cancel' })
    return false
  }
  return true
}
