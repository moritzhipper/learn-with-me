import { Component, computed, inject, signal } from '@angular/core'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { LanguageConfig, LearnableBase } from '@shared/types'
import { debounceTime, of, pipe, switchMap, tap } from 'rxjs'
import { AiService } from '../../../services/ai/ai.service'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  LearnableFromTextCreationConfig,
  TranslateFastConfig
} from '../../../types_and_schemas/types'
import { mapToStaggerVM } from '../../../utils/genaral-utils'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { LearnableComp } from '../overview-page-comp/learnable-comp/learnable-comp'

@Component({
  selector: 'app-translate-page-comp',
  imports: [PageIconComp, LearnableComp],
  templateUrl: './translate-page-comp.html',
  styleUrl: './translate-page-comp.scss',
  host: { class: 'page mid' }
})
export class TranslatePageComp {
  private readonly aiService = inject(AiService)
  private readonly activeBank = inject(LearnablesStore).activeBank
  translationWordCards = signal<LearnableBase[]>([])
  translationPhraseCards = signal<LearnableBase[]>([])
  fastTranslation = signal<string>('')

  proposedCards = computed(() => {
    const cards = [...this.translationWordCards(), ...this.translationPhraseCards()]
    return mapToStaggerVM(cards)
  })

  translateFast = rxMethod<TranslateFastConfig | null>(
    pipe(
      debounceTime(200),
      switchMap((v) => (v ? this.aiService.translateFast(v) : of(''))),
      tap((v) => this.fastTranslation.set(v))
    )
  )

  // more depbounce because more cost
  generateWordCards = rxMethod<LearnableFromTextCreationConfig | null>(
    pipe(
      debounceTime(1000),
      switchMap((v) => (v ? this.aiService.createLearnables(v) : of([]))),
      tapResponse({
        next: (learnables) => this.translationWordCards.set(learnables),
        error: console.error
      })
    )
  )

  generatePhraseCards = rxMethod<LearnableFromTextCreationConfig | null>(
    pipe(
      debounceTime(1000),
      switchMap((v) => (v ? this.aiService.createLearnables(v) : of([]))),
      tapResponse({
        next: (learnables) => this.translationPhraseCards.set(learnables),
        error: console.error
      })
    )
  )

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement
    const value = target.value.trim()
    const language = this.activeBank().language

    this.resetCards()
    if (language && value) {
      this.generateTranslations(value, language)
    }
  }

  generateTranslations(text: string, language: LanguageConfig) {
    this.translateFast({ text, language })
    this.generateWordCards({ source: 'text', text, language, type: 'word' })
    this.generatePhraseCards({ source: 'text', text, language, type: 'phrase' })
  }

  resetCards() {
    // reset proposals directly to ensure clean animations
    // reset fast translation with debounce to avoid flickering
    this.translateFast(null)
    this.translationWordCards.set([])
    this.translationPhraseCards.set([])
  }
}
