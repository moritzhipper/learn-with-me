import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { PracticeActive } from '@shared/types'
import { learnLanguageIcon, speakLanguageIcon } from '../../../../icon-registry'
import { LearnablesStore } from '../../../../store/learnables-store'
import { LearnablesFilterConfig } from '../../../../types/types'
import { aggregateConfidence } from '../../../../utils/genaral-utils'
import { filterLearnables } from '../../../../utils/learnables-filter'
import { ConfidenceDots } from '../../../shared/confidence/confidence-dots/confidence-dots'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

type SelectOption = {
  label: string
  confidence: number
  id: string | null
}

@Component({
  selector: 'app-configure-practice-comp',
  imports: [RadioComp, ReactiveFormsModule, ConfidenceDots],
  templateUrl: './configure-practice-comp.html',
  styleUrl: './configure-practice-comp.scss'
})
export class ConfigurePracticeComp {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly ls = inject(LearnablesStore)
  protected bank = this.ls.activeBank

  icons = {
    learnLanguageIcon,
    speakLanguageIcon
  }

  protected collections = this.ls.collections
  protected learnables = this.ls.learnables

  protected form = this._fb.group({
    type: null,
    collectionIdentifier: null,
    confidence: undefined,
    guessableField: 'translation'
  })

  private readonly _formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  })

  protected readonly selectedLearnables = computed(() => {
    const formValue = this._formSignal()

    const filter = {
      type: formValue.type,
      confidence: formValue.confidence
    } as LearnablesFilterConfig

    const filteredLearnables = filterLearnables(this.learnables(), filter)

    // Form allows selecting 'All Cards'. When this is selected, set collection id to null and return all cards
    const collection = this.collections().find(
      (c) => c.id === (formValue.collectionIdentifier as string | null)
    )
    if (!collection) return filteredLearnables

    return filteredLearnables.filter((l) => collection.cardIds.includes(l.id))
  })

  confidence = computed(() => aggregateConfidence(this.selectedLearnables()))

  start() {
    const iDs = this.selectedLearnables().map((l) => l.id)
    const guessableField = this.form.value.guessableField as PracticeActive['guessableField']
    this.ls.startPractice({
      type: 'custom',
      learnableIDs: iDs,
      guessableField
    })
  }

  protected selectOptions = computed<SelectOption[]>(() => {
    const { collections, learnables } = this.bank()

    const allOption: SelectOption = {
      label: 'All Cards',
      confidence: aggregateConfidence(learnables).all,
      id: null
    }

    const collectionOptions: SelectOption[] = collections.map((c) => {
      const cards = learnables.filter((l) => c.cardIds.includes(l.id))
      const confidence = aggregateConfidence(cards).all

      return { label: c.name, id: c.id, confidence }
    })

    return [allOption].concat(collectionOptions)
  })
}
