import { Component, inject } from '@angular/core'
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

@Component({
  selector: 'app-magic-translate',
  imports: [FormsModule, IconComp, RadioComp, ReactiveFormsModule],
  templateUrl: './magic-translate.html',
  styleUrl: './magic-translate.scss'
})
export class MagicTranslate {
  private readonly _fb = inject(NonNullableFormBuilder)

  form = this._fb.group({
    type: ['word'],
    text: ['']
  })
}
