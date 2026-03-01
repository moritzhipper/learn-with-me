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
import { debounceTime, filter, of, pipe, switchMap, tap } from 'rxjs'
import { AiService } from '../../../services/ai/ai.service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { TranslateFastConfig } from '../../../types_and_schemas/types'
import { mapToStaggerVM, StaggerVM } from '../../../utils/genaral-utils'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { LearnableComp } from '../overview-page-comp/learnable-comp/learnable-comp'

@Component({
  selector: 'app-translate-page-comp',
  imports: [PageIconComp, LearnableComp, FormsModule],
  templateUrl: './translate-page-comp.html',
  styleUrl: './translate-page-comp.scss',
  host: { class: 'page mid' }
})
export class TranslatePageComp {
  protected readonly FAST_TRANSLATION_DEBOUNCE_MS = 200
  private readonly aiService = inject(AiService)
  private readonly activeBank = inject(LearnablesStore).activeBank
  protected readonly lexemeInput = signal<string>('')
  protected fastTranslation = signal<string>('')
  protected readonly proposedCards = signal<StaggerVM<LearnableBase>>([])
  protected readonly smallText = computed(() => this.lexemeInput().length > 40)

  lexemeEl = viewChild.required<ElementRef<HTMLTextAreaElement>>('lexemeEl')
  translationEl = viewChild.required<ElementRef<HTMLDivElement>>('translationEl')

  constructor() {
    this.translateFast(this.creationConfig)
    this.generateProposedCards(this.creationConfig)

    afterRenderEffect(() => {
      const lexemeEl = this.lexemeEl().nativeElement
      const lexemIn = this.lexemeInput()
      const transEl = this.translationEl().nativeElement
      const transOut = this.fastTranslation()

      this.adjustHeight(lexemeEl)
      if (lexemIn && transOut) {
        this.adjustHeight(transEl)
      } else {
        transEl.style.height = '0px'
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

  private readonly creationConfig = computed<TranslateFastConfig | null>(() => {
    const language = this.activeBank().language
    const text = this.lexemeInput()
    if (!language || !text) return null

    return {
      language,
      text
    }
  })

  private readonly translateFast = rxMethod<TranslateFastConfig | null>(
    pipe(
      debounceTime(this.FAST_TRANSLATION_DEBOUNCE_MS),
      switchMap((v) => (v ? this.aiService.translateFast(v) : of(''))),
      tap((v) => this.fastTranslation.set(v))
    )
  )

  // more depbounce because more cost
  private readonly generateProposedCards = rxMethod<TranslateFastConfig | null>(
    pipe(
      tap(() => this.proposedCards.set([])),
      filter(Boolean),
      debounceTime(1000),
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
        error: console.error
      })
    )
  )
}
