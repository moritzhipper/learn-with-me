import { Component, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankShare } from '@shared/types'
import { BaseModalDirective } from '../base-modal-directive'

type CollectionPreview = {
  name: string
  learnablesCount: number
}

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  bank = input.required<BankShare>()
  form = new FormGroup({})
}
