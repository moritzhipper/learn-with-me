import { Component, inject } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { AnimDelay } from '../../../../directives/anim-delay'
import { BankExportOptions } from '../../../../utils/import-export-utils'
import { InfoCard } from '../../info-card/info-card'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type ExportBankLocalFormResult = Pick<BankExportOptions, 'includeUserData'>

@Component({
  selector: 'liz-export-bank-local-form',
  imports: [ReactiveFormsModule, RadioComp, InfoCard, AnimDelay],
  templateUrl: './export-bank-local-form.html',
  styleUrl: './export-bank-local-form.scss'
})
export class ExportBankLocalForm extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  protected form = this._fb.group<ExportBankLocalFormResult>({
    includeUserData: false
  })
}
