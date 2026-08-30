import { Component, effect, inject, input, untracked } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { BankBase } from '@shared/types'
import { BaseForm } from '../base-form/base-form'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-edit-bank-comp',
  imports: [ReactiveFormsModule, BaseForm],
  templateUrl: './edit-bank-comp.html'
})
export class EditBankComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)

  preset = input<BankBase>()

  protected form = this._fb.group({
    name: ['', Validators.required],
    speaking: ['', Validators.required],
    learning: ['', Validators.required]
  })

  constructor() {
    super()
    effect(() => {
      const preset = this.preset()
      if (!preset) return

      untracked(() => {
        this.form.setValue({
          name: preset.name,
          speaking: preset.language.speaking,
          learning: preset.language.learning
        })
      })
    })
  }

  submit() {
    if (this.form.invalid) return
    const { name, speaking, learning } = this.form.value

    this.confirm({
      name,
      language: { speaking, learning }
    })
  }
}
