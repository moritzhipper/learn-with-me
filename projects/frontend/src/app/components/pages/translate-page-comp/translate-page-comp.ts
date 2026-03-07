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
import { debounceTime, EMPTY, filter, pipe, switchMap, tap } from 'rxjs'
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
  protected readonly SMALL_TEXT_THRESHOLD = 100

  private readonly aiService = inject(AiService)
  private readonly ls = inject(LearnablesStore)
  private readonly toastService = inject(ToastService)
  private readonly activeBank = this.ls.activeBank
  protected readonly history = computed(() => this.ls.activeBank().translationHistory)
  protected readonly lexemeInput = signal<string>('')
  protected readonly translation = signal<string>('')
  protected readonly proposedCards = signal<StaggerVM<LearnableBase>>([])

  lexemeEl = viewChild.required<ElementRef<HTMLTextAreaElement>>('lexemeEl')
  translationWrapperEl = viewChild.required<ElementRef<HTMLDivElement>>('translationWrapperEl')
  translationEl = viewChild.required<ElementRef<HTMLDivElement>>('translationEl')

  protected isTranslationInitialized = false
  protected isTranslationFinished = false

  showSmallText = computed(() => {
    const biggestLength = Math.max(this.lexemeInput().length, this.translation().length)
    return biggestLength > this.SMALL_TEXT_THRESHOLD
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

      // Make both lexeme and translation wrapper always same height
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

  // Reset translation field, when inpu text field is empty
  // Save translition to history, when none is ongoing, a finished translation exists and 2s passed after the last userinput
  private readonly translateFast = rxMethod<TranslateFastConfig | null>(
    pipe(
      tap(() => {
        this.isTranslationFinished = false
      }),
      debounceTime(this.FAST_TRANSLATION_DEBOUNCE_MS),
      tap((v) => {
        this.isTranslationInitialized = false
      }),
      switchMap((v) => {
        if (v) return this.aiService.translateFastStream$(v)

        this.translation.set('')
        return EMPTY
      }),
      tapResponse({
        next: (v) => this.resolveTranslationStream(v),
        error: (e) => this.toastService.showHttpErrorToast(e)
      }),
      debounceTime(2000),
      filter((ev) => ev.type === 'response.completed' && this.isTranslationFinished),
      tap(() => this.saveTranslationHistoryItem())
    )
  )

  private resolveTranslationStream(event: ResponseStreamEvent) {
    if (event.type === 'response.output_text.delta' && !this.isTranslationInitialized) {
      this.isTranslationInitialized = true
      this.translation.set(event.delta)
    } else if (event.type === 'response.output_text.delta' && this.isTranslationInitialized) {
      this.translation.update((t) => t + event.delta)
    } else if (event.type === 'response.completed') {
      this.isTranslationFinished = true
    }
  }

  private saveTranslationHistoryItem() {
    console.log('Saving translation history item')
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
        error: (e) => this.toastService.showHttpErrorToast(e)
      })
    )
  )
}
