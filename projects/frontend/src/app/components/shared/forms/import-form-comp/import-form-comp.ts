import { Component, computed, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { BankShareBase, LanguageConfig } from '@shared/types'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { BankImportOptions } from 'projects/frontend/src/app/types/types'
import { InfoCard } from '../../info-card/info-card'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule, RadioComp, AnimDelay, InfoCard],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  bank = input.required<BankShareBase>()
  activeBankLanguage = input.required<LanguageConfig>()

  summary = computed(() => {
    const b = this.bank()
    const maxPreviewCards = 10
    const maxPreviewCollections = 20

    const cardsCount = b.learnables.length
    const previewCards = b.learnables.slice(0, maxPreviewCards)
    const cardsCountHidden = cardsCount - previewCards.length

    const collectionsCount = b.collections.length
    const previewCollections = b.collections.slice(0, maxPreviewCollections)
    const collectionsCountHidden = collectionsCount - previewCollections.length

    return {
      cardsCount,
      previewCards,
      cardsCountHidden,
      collectionsCount,
      previewCollections,
      collectionsCountHidden
    }
  })

  langMatch = computed(() => {
    const bankL = this.bank().language
    const activeL = this.activeBankLanguage()

    const strip = (str: string) => str.trim().toLowerCase()
    return (
      this.compare(bankL.learning, activeL.learning) &&
      this.compare(bankL.speaking, activeL.speaking)
    )
  })

  invertedLangMatch = computed(() => {
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

  form = this._fb.group<BankImportOptions>({
    strategy: 'merge',
    invertLanguageDirection: false
  })
}
