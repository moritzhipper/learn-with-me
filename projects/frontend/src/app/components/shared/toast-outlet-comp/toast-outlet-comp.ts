import { Component, inject } from '@angular/core'
import { ToastService } from '../../../services/toast-service'

@Component({
  selector: 'app-toast-outlet-comp',
  imports: [],
  templateUrl: './toast-outlet-comp.html',
  styleUrl: './toast-outlet-comp.scss'
})
export class ToastOutletComp {
  private readonly _toastService = inject(ToastService)
  protected toasts = this._toastService.toasts
}
