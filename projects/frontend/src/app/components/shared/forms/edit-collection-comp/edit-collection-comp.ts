import { Component, effect, inject, input, untracked } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { BaseForm } from '../base-form/base-form'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-edit-collection-comp',
  imports: [ReactiveFormsModule, BaseForm],
  templateUrl: './edit-collection-comp.html',
  styleUrl: './edit-collection-comp.scss'
})
export class EditCollectionComp extends BaseModalDirective {
  private _fb = inject(NonNullableFormBuilder)

  form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]]
  })

  name = input<string>()

  constructor() {
    super()
    effect(() => {
      const name = this.name()
      if (!name) return
      untracked(() => {
        this.form.patchValue({ name })
      })
    })
  }
}
