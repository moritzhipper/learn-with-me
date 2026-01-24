import { Component, computed, input } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankShareBase, LanguageConfig } from '@shared/types'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type ImportFormResult = {
  importStrategy: 'new' | 'merge'
}

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule, RadioComp],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  bank = input.required<BankShareBase>()
  activeBankLanguage = input.required<LanguageConfig>()

  differentLanguages = computed(() => {
    const bankL = this.bank().language
    const activeL = this.activeBankLanguage()

    return (
      bankL.learning.toLowerCase() !== activeL.learning.toLowerCase() ||
      bankL.speaking.toLowerCase() !== activeL.speaking.toLowerCase()
    )
  })

  form = new FormGroup({
    importStrategy: new FormControl<'merge' | 'new'>('merge')
  })

  onSubmit() {
    this.confirm(this.form.value)
  }
}
