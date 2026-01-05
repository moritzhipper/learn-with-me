import { Component, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankShareBase } from '@shared/types'
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
  bank = input.required<BankShareBase>()
  form = new FormGroup({})
}
