import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AnimDelay } from '../../../services/anim-delay'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { Bubble } from '../../shared/bubbles/bubble/bubble'
import { Bubbles } from '../../shared/bubbles/bubbles'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
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
    LearnableComp,
    AnimDelay,
    IconComp
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
  private readonly toastS = inject(ToastService)
  private readonly modalService = inject(ModalService)

  translations = computed(() => this.ls.activeBank().translations)

  protected async setTone() {
    const result = await this.modalService.open<string>('text-input', {
      preset: this.translations().tone
    })
    if (result.type === 'cancel') return

    this.ls.updateTranslateTone(result.value)
  }

  toggleMode() {
    if (this.selectedMode() === 'translate') {
      const selectedCardsText = this.ls
        .activeBank()
        .translations.history.filter((l) => this.selectedCardsIds().has(l.id))
        .map((c) => c.lexeme)
        .join('/n')
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

  selectAll() {
    const visibleCards =
      this.selectedMode() === 'translate'
        ? this.translations().history
        : this.translations().magicTranslateCards
    const allIds = visibleCards.map((c) => c.id)
    this.selectedCardsIds.set(new Set(allIds))
  }

  deleteSelection() {
    const selectedIds = [...this.selectedCardsIds()]
    this.resetSelection()
    if (this.selectedMode() === 'translate') {
      this.ls.deleteTranslationHistoryItems(selectedIds)
    } else {
      this.ls.deleteMagicTranslateItems(selectedIds)
    }
  }

  async importCards() {
    const visibleCards =
      this.selectedMode() === 'translate'
        ? this.translations().history
        : this.translations().magicTranslateCards
    const selectedCards = visibleCards.filter((c) => this.selectedCardsIds().has(c.id))
    if (!selectedCards.length) return

    const collections = this.ls.activeBank().collections

    const result = await this.modalService.open<ConfirmCollectionAddType>('collection-add', {
      collections,
      cardIds: selectedCards.map((c) => c.id)
    })

    if (result.type === 'cancel') return

    // create collection user wishes creation of new one
    const collectionID =
      'addToId' in result.value
        ? result.value.addToId
        : this.ls.createCollection(result.value.createName)

    // import cards
    const cardIDs = this.ls.createCards(selectedCards)

    // add to collection
    this.ls.updateCollection({ id: collectionID, addIDs: cardIDs })

    this.toastS.showToast('Cards imported successfully!')
  }
}
