import { afterNextRender, Component, input } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AnimDelay } from '../../../../services/anim-delay'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-text-input-form',
  imports: [ReactiveFormsModule, AnimDelay],
  templateUrl: './set-tone-form.html',
  styleUrl: './set-tone-form.scss'
})
export class SetToneForm extends BaseModalDirective {
  preset = input<string>()

  form = new FormGroup({
    text: new FormControl('', [Validators.required])
  })

  constructor() {
    super()
    afterNextRender(() => {
      const preset = this.preset()
      if (!preset) return
      this.form.setValue({ text: preset })
    })
  }
}
