import { Component, computed, input } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankShareBase, LanguageConfig } from '@shared/types'
import { ImportStrategy } from 'projects/frontend/src/app/types/types'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type ImportFormResult = {
  importStrategy: ImportStrategy
}

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule, RadioComp],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
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

  differentLanguages = computed(() => {
    const bankL = this.bank().language
    const activeL = this.activeBankLanguage()

    return (
      bankL.learning.toLowerCase() !== activeL.learning.toLowerCase() ||
      bankL.speaking.toLowerCase() !== activeL.speaking.toLowerCase()
    )
  })

  form = new FormGroup({
    importStrategy: new FormControl<ImportStrategy>('merge')
  })

  onSubmit() {
    this.confirm(this.form.value)
  }
}
