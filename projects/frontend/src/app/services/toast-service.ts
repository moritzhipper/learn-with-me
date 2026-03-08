import { computed, Injectable, signal } from '@angular/core'

export type ToastOptions = {
  header?: string
  message: string
  type: 'info' | 'error'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<ToastOptions[]>([])
  private readonly TOAST_TTL = 6000

  toasts = computed(() => this._toasts())
  showToast(config: ToastOptions | string) {
    if (typeof config === 'string') {
      config = { message: config, type: 'info' }
    }

    this._toasts.update((toasts) => [...toasts, config])

    setTimeout(() => {
      this._toasts.update((t) => t.slice(1))
    }, this.TOAST_TTL)
  }

  showHttpErrorToast(error: unknown) {
    const errorText = error instanceof Error ? error.message : String(error)
    this.showToast({
      message: errorText,
      type: 'error'
    })
  }
}
