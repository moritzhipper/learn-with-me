import { Component, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LanguageConfig, PracticeConfig } from '@shared/types'

import { learnLanguageIcon, speakLanguageIcon } from '../../../../icon-registry'
import { ConfidenceAggregate } from '../../../../utils/genaral-utils'
import { ConfidenceDots } from '../../confidence/confidence-dots/confidence-dots'
import { ConfidenceStats } from '../../confidence/confidence-stats/confidence-stats'
import { InfoCard } from '../../info-card/info-card'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseForm } from '../base-form/base-form'
import { BaseModalDirective } from '../base-modal-directive'

export type StartPracticeFormResult = {
  guessableField: PracticeConfig['guessableField']
}

export type StartPracticeFormConfig = {
  hasActivePractice?: boolean
  confidence?: ConfidenceAggregate
  languageConfig: LanguageConfig
}

@Component({
  selector: 'app-start-practice-form',
  imports: [ReactiveFormsModule, RadioComp, InfoCard, ConfidenceDots, ConfidenceStats, BaseForm],
  templateUrl: './start-practice-form.html',
  styleUrl: './start-practice-form.scss'
})
export class StartPracticeForm extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group<Pick<StartPracticeFormResult, 'guessableField'>>({
    guessableField: 'translation'
  })

  understandIcon = learnLanguageIcon
  speakingIcon = speakLanguageIcon

  config = input.required<StartPracticeFormConfig>()
}
