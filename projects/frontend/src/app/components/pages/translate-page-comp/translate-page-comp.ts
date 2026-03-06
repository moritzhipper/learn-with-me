import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { LearnableBase } from '@shared/types'
import { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs'
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs'
import { AiService } from '../../../services/ai/ai.service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { TranslateFastConfig } from '../../../types_and_schemas/types'
import { mapToStaggerVM, StaggerVM } from '../../../utils/genaral-utils'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { LearnableComp } from '../overview-page-comp/learnable-comp/learnable-comp'

@Component({
  selector: 'app-translate-page-comp',
  imports: [PageIconComp, LearnableComp, FormsModule, IconComp],
  templateUrl: './translate-page-comp.html',
  styleUrl: './translate-page-comp.scss',
  host: { class: 'page mid' }
})
export class TranslatePageComp {
  protected readonly FAST_TRANSLATION_DEBOUNCE_MS = 400
  protected readonly PROPOSED_CARDS_DEBOUNCE_MS = 1500
  protected readonly NORMAL_TEXT_THRESHOLD = 50
  protected readonly SMALL_TEXT_THRESHOLD = 150

  private readonly aiService = inject(AiService)
  private readonly ls = inject(LearnablesStore)
  private readonly toastService = inject(ToastService)
  private readonly activeBank = this.ls.activeBank
  protected readonly history = computed(() => this.ls.activeBank().translationHistory)
  protected readonly lexemeInput = signal<string>('')
  protected readonly translation = signal<string>('')
  protected readonly proposedCards = signal<StaggerVM<LearnableBase>>([])
  protected readonly smallText = computed(() => this.lexemeInput().length > 40)

  lexemeEl = viewChild.required<ElementRef<HTMLTextAreaElement>>('lexemeEl')
  translationWrapperEl = viewChild.required<ElementRef<HTMLDivElement>>('translationWrapperEl')
  translationEl = viewChild.required<ElementRef<HTMLDivElement>>('translationEl')

  protected resetOnNextTransEvent = false

  textSizeClass = computed(() => {
    const biggestLength = Math.max(this.lexemeInput().length, this.translation().length)
    if (biggestLength > this.SMALL_TEXT_THRESHOLD) {
      return 'small'
    } else if (biggestLength > this.NORMAL_TEXT_THRESHOLD) {
      return 'normal'
    } else {
      return 'big'
    }
  })

  constructor() {
    this.translateFast(this.creationConfig)
    // this.generateProposedCards(this.creationConfig)

    setTimeout(() => {
      this.lexemeEl().nativeElement.focus()
    }, 100)

    afterRenderEffect(() => {
      const lexemeEl = this.lexemeEl().nativeElement
      const lexemIn = this.lexemeInput()
      const transWrapperEl = this.translationWrapperEl().nativeElement
      const transOut = this.translation()
      const transEl = this.translationEl().nativeElement

      this.adjustHeight(lexemeEl)
      if (lexemIn && transOut && transEl) {
        const biggerHeight = Math.max(lexemeEl.scrollHeight, transEl.scrollHeight)
        transWrapperEl.style.height = `${biggerHeight}px`
      } else {
        transWrapperEl.style.height = '0px'
      }
    })
  }

  adjustHeight(el: HTMLElement) {
    // Disable transition -> would keep the element at non zero height until its finished
    const previousHeight = el.style.height
    el.style.transition = 'none'

    // Set element height to 0 to measure real scrollHeight
    el.style.height = '0px'
    const targetHeight = el.scrollHeight

    // Force browser reflow
    // Set previous height as starting point for animation
    el.style.height = previousHeight
    void el.offsetHeight

    // Clear the inline transition style so CSS transition takes over again
    el.style.transition = ''
    // Apply the measured height to trigger the CSS animation
    el.style.height = `${targetHeight}px`
  }

  private readonly creationConfig = computed<TranslateFastConfig | null>(
    () => {
      const language = this.activeBank().language
      const text = this.lexemeInput()
      if (!language || !text) return null

      return {
        language,
        text
      }
    },
    { equal: (a, b) => a?.language === b?.language && a?.text === b?.text }
  )

  private readonly translateFast = rxMethod<TranslateFastConfig | null>(
    pipe(
      debounceTime(this.FAST_TRANSLATION_DEBOUNCE_MS),
      tap((v) => {
        if (!v) this.translation.set('')
      }),
      filter(Boolean),
      switchMap((v) => this.aiService.translateFastStream$(v)),
      tapResponse({
        next: (v) => this.resolveStreamingTranslation(v),
        error: (e) => this.toastService.showToast({ message: 'Translation failed', type: 'error' })
      }),
      debounceTime(3000),
      filter((event) => event.type === 'response.completed'),
      tap(() => this.saveTranslationHistoryItem())
    )
  )

  private resolveStreamingTranslation(event: ResponseStreamEvent) {
    if (event.type === 'response.created') {
      this.resetOnNextTransEvent = true
    } else if (event.type === 'response.output_text.delta' && this.resetOnNextTransEvent) {
      this.resetOnNextTransEvent = false
      this.translation.set(event.delta)
    } else if (event.type === 'response.output_text.delta') {
      this.translation.update((t) => t + event.delta)
    }
  }

  private saveTranslationHistoryItem() {
    const lexeme = this.lexemeInput()
    const translation = this.translation()
    this.ls.addTranslationHistoryItem({
      lexeme: this.lexemeInput(),
      translation: this.translation()
    })
  }

  protected deleteHistoryItem(id: string) {
    this.ls.deleteTranslationHistoryItem(id)
  }

  private readonly generateProposedCards = rxMethod<TranslateFastConfig | null>(
    pipe(
      debounceTime(this.PROPOSED_CARDS_DEBOUNCE_MS),
      tap((v) => {
        if (!v) this.proposedCards.set([])
      }),
      filter(Boolean),
      switchMap((v) =>
        this.aiService.createLearnables({
          type: 'both',
          language: v.language,
          text: v.text,
          source: 'text'
        })
      ),
      tapResponse({
        next: (learnables) => this.proposedCards.set(mapToStaggerVM(learnables)),
        error: (e) =>
          this.toastService.showToast({
            message: 'Failed to generate proposed cards',
            type: 'error'
          })
      })
    )
  )
}
