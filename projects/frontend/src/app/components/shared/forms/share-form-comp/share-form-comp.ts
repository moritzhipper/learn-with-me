import { Component, computed, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { BankShareConfig, BankUser } from '@shared/types'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseForm } from '../base-form/base-form'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-share-form-comp',
  imports: [ReactiveFormsModule, RadioComp, BaseForm],
  templateUrl: './share-form-comp.html'
})
export class ShareFormComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group<BankShareConfig>({
    ttlMinutes: 5,
    isCommunityBank: true
  })

  bank = input.required<BankUser>()

  title = computed(() => {
    const bank = this.bank()
    return bank.collections.length === 1 ? bank.collections[0].name : bank.name
  })
}
