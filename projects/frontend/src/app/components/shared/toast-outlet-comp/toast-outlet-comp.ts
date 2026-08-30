import { Component, inject } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { infoIcon, warningIcon } from '../../../icon-registry'
import { ToastService } from '../../../services/toast-service'

@Component({
  selector: 'app-toast-outlet-comp',
  imports: [NgIcon],
  templateUrl: './toast-outlet-comp.html',
  styleUrl: './toast-outlet-comp.scss'
})
export class ToastOutletComp {
  private readonly _toastService = inject(ToastService)
  protected toasts = this._toastService.toasts

  protected readonly icons = {
    infoIcon,
    warningIcon
  }
}
