import { NgComponentOutlet } from '@angular/common'
import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OutputRefSubscription,
  untracked,
  viewChild
} from '@angular/core'
import { ModalService } from '../../../../services/modal-service'
import { BaseModalDirective } from '../base-modal-directive'
import { getModalComponent } from '../modal-config'

@Component({
  selector: 'liz-modal-outlet',
  imports: [NgComponentOutlet],
  templateUrl: './modal-outlet.html',
  styleUrl: './modal-outlet.scss'
})
export class ModalOutletComp {
  isOpen = computed(() => !!this.modalService.currentlyOpenModalConfig())
  outlet = viewChild(NgComponentOutlet)
  private _submitSubscription: OutputRefSubscription | null = null

  modalService = inject(ModalService)

  currentModalConfig = computed(() => {
    const modalConf = this.modalService.currentlyOpenModalConfig()
    if (!modalConf) return null
    const component = getModalComponent(modalConf.type)
    if (!component) return null

    const config = modalConf.config

    if (!config) {
      return { component }
    }

    return {
      inputs: { ...config },
      component
    }
  })

  constructor() {
    effect(() => {
      const instance = this.outlet()?.componentInstance as BaseModalDirective

      untracked(() => {
        if (instance) {
          this._submitSubscription = instance.resolve.subscribe(
            this.modalService.resolveModal.bind(this.modalService)
          )
        } else {
          this._submitSubscription?.unsubscribe()
          this._submitSubscription = null
        }
      })
    })
  }

  @HostListener('window:keydown.escape')
  close() {
    this.modalService.resolveModal({ type: 'cancel' })
  }
}
