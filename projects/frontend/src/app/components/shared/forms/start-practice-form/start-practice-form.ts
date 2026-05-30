import { Component, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { PracticeConfig } from '@shared/types'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type StartPracticeFormConf = {
  direction: PracticeConfig['direction']
}

@Component({
  selector: 'app-start-practice-form',
  imports: [ReactiveFormsModule, RadioComp, AnimDelay],
  templateUrl: './start-practice-form.html',
  styleUrl: './start-practice-form.scss'
})
export class StartPracticeForm extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group<Pick<StartPracticeFormConf, 'direction'>>({
    direction: 'forward'
  })

  direction = input.required<PracticeConfig['direction']>()
  hasActicePractice = input<boolean>()
}
