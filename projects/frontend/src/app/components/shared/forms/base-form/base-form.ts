import { Component, input, output } from '@angular/core'
import { AnimDelayWrapper } from '../../../../directives/anim-delay-wrapper'

@Component({
  selector: '[liz-base-form]',
  imports: [AnimDelayWrapper],
  templateUrl: './base-form.html',
  styleUrl: './base-form.scss'
})
export class BaseForm {
  readonly header = input.required<string>()
  readonly confirmLabel = input<string>('Confirm')
  readonly cancelLabel = input<string>('Cancel')

  readonly cancel = output<void>()
}
