import { Component, computed, effect, inject, input } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { BankShareBase, LanguageConfig } from '@shared/types'
import { map } from 'rxjs'
import { AnimDelayWrapper } from '../../../../directives/anim-delay-wrapper'
import { IconComp } from '../../icon-comp/icon-comp'
import { InfoCard } from '../../info-card/info-card'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type BankImportOptions = {
  strategy: 'merge' | 'new'
  invertLanguageDirection: boolean
}

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule, RadioComp, AnimDelayWrapper, InfoCard, IconComp],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  bank = input.required<BankShareBase>()
  activeBankLanguage = input.required<LanguageConfig>()

  form = this._fb.group<BankImportOptions>({
    strategy: 'merge',
    invertLanguageDirection: false
  })

  private formSignal = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue()
  })

  constructor() {
    super()
    effect(() => {
      const invertMatch = this.LangMatchInvertDir()
      const match = this.langMatchDefaultDir()
      if (invertMatch) {
        this.form.controls.invertLanguageDirection.setValue(true)
      } else if (!invertMatch && !match) {
        this.form.controls.strategy.setValue('new')
      }
    })
  }

  protected strategy = computed(() => this.formSignal().strategy)
  protected importLanguagesMatch = computed(() => {
    const invertSelected = this.formSignal().invertLanguageDirection
    return (
      (this.langMatchDefaultDir() && !invertSelected) ||
      (this.LangMatchInvertDir() && invertSelected)
    )
  })

  protected importLangAfterImport = computed<LanguageConfig>(() => {
    const { speaking, learning } = this.bank().language
    const invert = this.formSignal().invertLanguageDirection

    return {
      speaking: invert ? learning : speaking,
      learning: invert ? speaking : learning
    }
  })

  private langMatchDefaultDir = computed(() => {
    const bankL = this.bank().language
    const activeL = this.activeBankLanguage()

    const strip = (str: string) => str.trim().toLowerCase()
    return (
      this.compare(bankL.learning, activeL.learning) &&
      this.compare(bankL.speaking, activeL.speaking)
    )
  })

  private LangMatchInvertDir = computed(() => {
    const bankL = this.bank().language
    const activeL = this.activeBankLanguage()

    return (
      this.compare(bankL.learning, activeL.speaking) &&
      this.compare(bankL.speaking, activeL.learning)
    )
  })

  private compare(a: string, b: string) {
    return a.trim().toLowerCase() === b.trim().toLowerCase()
  }
}
