import { Component, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { InfoCard } from '../../info-card/info-card'
import { BaseForm } from '../base-form/base-form'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-confirm-form-comp',
  imports: [ReactiveFormsModule, BaseForm, InfoCard],
  templateUrl: './confirm-form-comp.html'
})
export class ConfirmFormComp extends BaseModalDirective {
  message = input<string | null>(null)
  warning = input<string>()
  info = input<string>()
  description = input<string>()
  label = input<string>('Confirm')

  form = new FormGroup({})
}
