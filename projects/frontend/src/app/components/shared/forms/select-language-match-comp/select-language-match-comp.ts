import { Component, effect, inject, input, untracked } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LanguageConfig } from '@shared/types'
import { BaseForm } from '../base-form/base-form'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-select-language-match-comp',
  imports: [ReactiveFormsModule, BaseForm],
  templateUrl: './select-language-match-comp.html'
})
export class SelectLanguageMatchComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)

  preset = input<LanguageConfig>()

  form = this._fb.group({
    speaking: [''],
    learning: ['']
  })

  constructor() {
    super()
    effect(() => {
      const preset = this.preset()
      if (!preset) return

      untracked(() => {
        this.form.setValue({
          speaking: preset.speaking ?? '',
          learning: preset.learning ?? ''
        })
      })
    })
  }
}
