import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import { Bubble } from '../../shared/bubbles/bubble/bubble'
import { Bubbles } from '../../shared/bubbles/bubbles'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { LearnableComp } from '../overview-page-comp/learnable-comp/learnable-comp'
import { MagicTranslate } from './magic-translate/magic-translate'
import { QuickTranslate } from './quick-translate/quick-translate'

@Component({
  selector: 'app-translate-page-comp',
  imports: [
    PageIconComp,
    FormsModule,
    QuickTranslate,
    MagicTranslate,
    Bubbles,
    Bubble,
    LearnableComp
  ],
  templateUrl: './translate-page-comp.html',
  styleUrl: './translate-page-comp.scss',
  host: { class: 'page mid' }
})
export class TranslatePageComp {
  selectedMode = signal<'translate' | 'magic'>('translate')
  magicPreset = signal<string>('')
  selectedCardsIds = signal<Set<string>>(new Set())
  private readonly ls = inject(LearnablesStore)

  translations = computed(() => this.ls.activeBank().translations)

  protected setTone(tone: string) {
    this.ls.updateTranslateTone(tone)
  }

  toggleMode() {
    if (this.selectedMode() === 'translate') {
      const selectedCardsText = this.ls
        .activeBank()
        .translations.history.filter((l) => this.selectedCardsIds().has(l.id))
        .map((c) => c.lexeme)
        .join(', ')
      this.magicPreset.set(selectedCardsText)
      this.selectedMode.set('magic')
    } else {
      this.selectedMode.set('translate')
      this.magicPreset.set('')
    }
    this.selectedCardsIds.set(new Set())
  }

  toggleSelection(cardId: string) {
    this.selectedCardsIds.update((ids) => {
      if (ids.has(cardId)) {
        ids.delete(cardId)
      } else {
        ids.add(cardId)
      }
      return ids
    })
  }

  isSelected(cardId: string) {
    return this.selectedCardsIds().has(cardId)
  }

  resetSelection() {
    this.selectedCardsIds.set(new Set())
  }

  async importCards() {
    // const proposed = this.proposedCards()
    // const selectedCards = proposed
    //   .map((p) => p.item)
    //   .filter((c) => this.selectedCardsIds().includes(c.id))
    // if (!selectedCards.length) return
    // const result = await this.modalService.open('confirm', {
    //   message: `Do you want to import ${selectedCards.length} cards?`
    // })
    // if (result.type === 'cancel') return
    // this.ls.addLearnables(selectedCards)
    // this.toastService.showToast('Cards imported successfully!')
  }
}
