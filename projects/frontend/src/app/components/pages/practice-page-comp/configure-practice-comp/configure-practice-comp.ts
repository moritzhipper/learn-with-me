import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { PracticeActive } from '@shared/types'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { LearnablesFilterConfig } from '../../../../types/types'
import { calculateAverageConfidencePercent } from '../../../../utils/genaral-utils'
import { filterLearnables } from '../../../../utils/learnables-filter'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

type SelectOption = {
  label: string
  confidence: number
  id: string | null
}

@Component({
  selector: 'app-configure-practice-comp',
  imports: [RadioComp, ReactiveFormsModule],
  templateUrl: './configure-practice-comp.html',
  styleUrl: './configure-practice-comp.scss'
})
export class ConfigurePracticeComp {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly _lStore = inject(LearnablesStore)
  protected bank = this._lStore.activeBank

  protected collections = this._lStore.collections
  protected learnables = this._lStore.learnables

  protected form = this._fb.group({
    type: null,
    collectionIdentifier: null,
    confidence: undefined,
    direction: 'forward'
  })

  private readonly _formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  })

  protected readonly selectedLearnableIds = computed(() => {
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
    if (!collection) return filteredLearnables.map((l) => l.id)

    return filteredLearnables.filter((l) => collection.cardIds.includes(l.id)).map((l) => l.id)
  })

  start() {
    const iDs = this.selectedLearnableIds()
    const direction = this.form.value.direction as PracticeActive['direction']
    this._lStore.startPractice(iDs, direction)
  }

  protected selectOptions = computed<SelectOption[]>(() => {
    const { collections, learnables } = this.bank()

    const allOption: SelectOption = {
      label: 'All Cards',
      confidence: calculateAverageConfidencePercent(learnables),
      id: null
    }
    const collectionOptions: SelectOption[] = collections.map((c) => {
      const cards = learnables.filter((l) => c.cardIds.includes(l.id))
      const confidence = calculateAverageConfidencePercent(cards)

      return { label: c.name, id: c.id, confidence }
    })

    return [allOption].concat(collectionOptions)
  })

  calculateAverageConfidence(learnableIds: string[]): number {
    const learnables = this._lStore.learnables().filter((l) => learnableIds.includes(l.id))

    return calculateAverageConfidencePercent(learnables)
  }
}
