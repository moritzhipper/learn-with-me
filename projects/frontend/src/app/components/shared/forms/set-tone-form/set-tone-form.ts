import { Component } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-text-input-form',
  imports: [ReactiveFormsModule, AnimDelay],
  templateUrl: './set-tone-form.html',
  styleUrl: './set-tone-form.scss'
})
export class SetToneForm extends BaseModalDirective {
  form = new FormGroup({
    text: new FormControl('', [Validators.required])
  })
}
