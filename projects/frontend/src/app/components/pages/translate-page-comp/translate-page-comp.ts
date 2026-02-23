import { Component, inject, signal } from '@angular/core'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { LearnableBase } from '@shared/types'
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs'
import { AiService } from '../../../services/ai/ai.service'
import { LearnablesStore } from '../../../store/learnablesStore'
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
  translationCard = signal<LearnableBase | null>(null)

  translate = rxMethod<string | null>(
    pipe(
      filter(Boolean),
      debounceTime(200),
      switchMap((v) => this.callAiTranslate(v)),
      tap((v) => this.translationCard.set(v))
    )
  )

  onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    const value = target.value
    this.translate(value)
  }

  async callAiTranslate(content: string): Promise<LearnableBase | null> {
    const language = this.activeBank().language
    if (!language) return null
    const card = await this.aiService.translateDirectly(content, language)
    return card
  }
}
