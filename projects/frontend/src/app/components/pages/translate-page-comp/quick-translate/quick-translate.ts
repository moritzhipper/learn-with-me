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
import {
  ResponseStreamEvent,
  ResponseTextDoneEvent
} from 'openai/resources/responses/responses.mjs'
import { AiService } from 'projects/frontend/src/app/services/ai/ai.service'
import { ToastService } from 'projects/frontend/src/app/services/toast-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnables-store'
import { TranslateFastConfig } from 'projects/frontend/src/app/types/types'
import { debounceTime, delay, EMPTY, filter, from, map, pipe, switchMap, tap } from 'rxjs'

@Component({
  selector: 'app-quick-translate',
  imports: [FormsModule],
  templateUrl: './quick-translate.html',
  styleUrl: './quick-translate.scss'
})
export class QuickTranslate {
  protected readonly FAST_TRANSLATION_DEBOUNCE_MS = 400
  protected readonly SMALL_TEXT_THRESHOLD = 70

  private readonly aiService = inject(AiService)
  private readonly ls = inject(LearnablesStore)
  private readonly toastService = inject(ToastService)

  private readonly activeBank = this.ls.activeBank

  protected readonly tone = computed(() => this.ls.activeBank().translations.tone)
  protected readonly lexemeInput = signal<string>('')
  protected readonly translation = signal<string>('')

  lexemeEl = viewChild.required<ElementRef<HTMLTextAreaElement>>('lexemeEl')
  translationWrapperEl = viewChild.required<ElementRef<HTMLDivElement>>('translationWrapperEl')
  translationEl = viewChild.required<ElementRef<HTMLDivElement>>('translationEl')

  protected lastTranslation = ''
  protected newTranslation = ''

  showSmallText = computed(() => {
    const biggestLength = Math.max(this.lexemeInput().length, this.translation().length)
    return biggestLength > this.SMALL_TEXT_THRESHOLD
  })

  constructor() {
    this.translateFast(this.creationConfig)

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
      const tone = this.tone()

      if (!language || !text) return null

      return {
        language,
        text,
        tone
      }
    },
    {
      equal: (a, b) => a?.language === b?.language && a?.text === b?.text && a?.tone === b?.tone
    }
  )

  // Reset translation field, when inpu text field is empty
  // Save translition to history, when none is ongoing, a finished translation exists and 2s passed after the last userinput
  private readonly translateFast = rxMethod<TranslateFastConfig | null>(
    pipe(
      debounceTime(this.FAST_TRANSLATION_DEBOUNCE_MS),
      switchMap((config) => {
        if (!config) {
          this.translation.set('')
          return EMPTY
        }

        return this.aiService.translateFastStream$(config).pipe(
          tapResponse({
            next: (event) => this.mapStreamToTranslation(event),
            error: (e) => this.toastService.showHttpErrorToast(e)
          }),
          filter((ev): ev is ResponseTextDoneEvent => {
            const isFinishedEvent = ev.type === 'response.output_text.done'
            const isCurrentUserInput =
              config.text === this.lexemeInput() && config.tone === this.tone()
            return isFinishedEvent && isCurrentUserInput
          }),
          map((ev) => ({
            lexeme: config.text,
            translation: ev.text
          })),
          switchMap((learnable) =>
            from(this.aiService.categorizeCard(learnable)).pipe(
              map((category) => ({
                ...learnable,
                type: category
              }))
            )
          ),
          delay(2000),
          tap((learnable) => {
            const tone = config.tone ? `Tone: ${config.tone}` : ''
            this.ls.addTranslationHistoryItem({
              ...learnable,
              notes: tone
            })
          })
        )
      })
    )
  )

  private mapStreamToTranslation(event: ResponseStreamEvent) {
    if (event.type === 'response.created') {
      this.newTranslation = ''
    }
    // Apply old translation to ui from last stream, as long as the new transaltion starts the same and is not finished
    // Prevents flicker on same translation start
    if (event.type === 'response.output_text.delta') {
      this.newTranslation += event.delta
      if (this.lastTranslation.startsWith(this.newTranslation)) {
        this.translation.set(this.lastTranslation)
      } else {
        this.lastTranslation = this.newTranslation
        this.translation.set(this.newTranslation)
      }
    }
    if (event.type === 'response.output_text.done') {
      this.lastTranslation = event.text
      this.translation.set(this.lastTranslation)
    }
  }
}
