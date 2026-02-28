import { Component, computed, inject, signal } from '@angular/core'
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
  private readonly aiService = inject(AiService)
  private readonly activeBank = inject(LearnablesStore).activeBank
  protected readonly lexemeInput = signal<string>('')
  protected fastTranslation = signal<string>('')
  protected readonly proposedCards = signal<StaggerVM<LearnableBase>>([])
  protected readonly smallText = computed(() => this.lexemeInput().length > 40)

  constructor() {
    this.translateFast(this.creationConfig)
    this.generateProposedCards(this.creationConfig)
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
      debounceTime(200),
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
