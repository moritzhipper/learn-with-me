import { Component, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { BankShareConfigParams, BankUser } from '@shared/types'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-share-form-comp',
  imports: [ReactiveFormsModule, RadioComp],
  templateUrl: './share-form-comp.html',
  styleUrl: './share-form-comp.scss'
})
export class ShareFormComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group<BankShareConfigParams>({
    ttlMinutes: 5,
    isCommunityBank: false
  })

  bank = input.required<BankUser>()
}
