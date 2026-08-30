import { Component, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BaseForm } from '../base-form/base-form'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-confirm-form-comp',
  imports: [ReactiveFormsModule, BaseForm],
  templateUrl: './confirm-form-comp.html'
})
export class ConfirmFormComp extends BaseModalDirective {
  message = input<string | null>(null)
  description = input<string>()
  label = input<string>('confirm')
  form = new FormGroup({})
}
