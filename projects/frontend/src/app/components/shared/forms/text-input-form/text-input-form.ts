import { Component } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-text-input-form',
  imports: [ReactiveFormsModule, AnimDelay],
  templateUrl: './text-input-form.html',
  styleUrl: './text-input-form.scss'
})
export class TextInputForm extends BaseModalDirective {
  form = new FormGroup({
    text: new FormControl('', [Validators.required])
  })
}
