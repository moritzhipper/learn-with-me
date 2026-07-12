import { Component, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { PracticeConfig } from '@shared/types'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { InfoCard } from '../../info-card/info-card'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type StartPracticeFormResult = {
  guessableField: PracticeConfig['guessableField']
}

export type StartPracticeFormConfig = {
  guessableField: PracticeConfig['guessableField']
  confidence: {
    translation: number
    lexeme: number
  }
}

@Component({
  selector: 'app-start-practice-form',
  imports: [ReactiveFormsModule, RadioComp, AnimDelay, InfoCard],
  templateUrl: './start-practice-form.html',
  styleUrl: './start-practice-form.scss'
})
export class StartPracticeForm extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group<Pick<StartPracticeFormResult, 'guessableField'>>({
    guessableField: 'translation'
  })

  guessableField = input.required<PracticeConfig['guessableField']>()
  hasActivePractice = input<boolean>()
}
