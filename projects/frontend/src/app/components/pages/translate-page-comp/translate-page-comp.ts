import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixPencilFill } from '@ng-icons/remixicon'
import { AnimDelayWrapper } from '../../../directives/anim-delay-wrapper'
import { CardsSelector } from '../../../services/cards-selector'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnables-store'
import { LearnableComp } from '../../shared/banks-and-collections/learnable-comp/learnable-comp'
import { Bubble } from '../../shared/bubbles/bubble/bubble'
import { Bubbles } from '../../shared/bubbles/bubbles'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { InfoCard } from '../../shared/info-card/info-card'
import { PageWrapper } from '../page-wrapper/page-wrapper'
import { MagicTranslate } from './magic-translate/magic-translate'
import { QuickTranslate } from './quick-translate/quick-translate'

@Component({
  selector: 'app-translate-page-comp',
  providers: [CardsSelector, provideIcons({ remixPencilFill })],
  imports: [
    FormsModule,
    QuickTranslate,
    MagicTranslate,
    Bubbles,
    Bubble,
    LearnableComp,
    AnimDelayWrapper,
    NgIcon,
    PageWrapper,
    InfoCard
  ],
  templateUrl: './translate-page-comp.html',
  styleUrl: './translate-page-comp.scss'
})
export class TranslatePageComp {
  selectedMode = signal<'translate' | 'magic'>('translate')
  magicPreset = signal<string>('')
  private readonly ls = inject(LearnablesStore)
  private readonly toastS = inject(ToastService)
  private readonly modalService = inject(ModalService)

  protected selector = inject(CardsSelector)

  private cardsWrapper = viewChild<ElementRef<HTMLElement>>('cardsWrapper')

  bubbleIconConfig = computed(() => {
    const currentMode = this.selectedMode()
    if (currentMode === 'magic') return 'translate'
    return 'magic'
  })

  constructor() {
    if (history.state?.mode === 'magic') {
      this.selectedMode.set('magic')
    }
  }

  protected cards = computed(() => {
    if (this.selectedMode() === 'translate') {
      return this.ls.activeBank().translations.history
    }
    return this.ls.activeBank().translations.magicTranslateCards
  })

  protected tone = computed(() => this.ls.activeBank().translations.tone)

  protected async setTone() {
    const result = await this.modalService.open<string>('text-input', {
      preset: this.tone()
    })
    if (result.type === 'cancel') return

    this.ls.updateTranslateTone(result.value)
  }

  // toggles mode, puts selected cards as preset for magic mode should they be selected
  toggleMode() {
    if (this.selectedMode() === 'translate') {
      const selectedCardsText = this.ls
        .activeBank()
        .translations.history.filter((l) => this.selector.selected().has(l.id))
        .map((c) => c.lexeme)
        .join('\n')
      this.magicPreset.set(selectedCardsText)
      this.selectedMode.set('magic')
    } else {
      this.selectedMode.set('translate')
      this.magicPreset.set('')
    }
    this.selector.reset()
  }

  deleteSelection() {
    const selectedIds = [...this.selector.selected()]
    this.selector.reset()
    if (this.selectedMode() === 'translate') {
      this.ls.deleteTranslationHistoryItems(selectedIds)
    } else {
      this.ls.deleteMagicTranslateItems(selectedIds)
    }
  }

  async importCards() {
    const selectedCards = this.cards().filter((c) => this.selector.selected().has(c.id))
    if (!selectedCards.length) return

    const collections = this.ls.activeBank().collections

    const result = await this.modalService.open<ConfirmCollectionAddType>('collection-add', {
      collections,
      cardIds: selectedCards.map((c) => c.id)
    })

    if (result.type === 'cancel') return

    // create collection user wishes creation of new one
    const collectionID = result.value.addToId || this.ls.createCollection(result.value.createName)

    // import cards
    const { idsOfAll: idsOfAllAdded } = this.ls.importCards(selectedCards)

    // add to collection
    this.ls.updateCollection({ id: collectionID, addIDs: idsOfAllAdded })

    this.toastS.showToast('Card(s) imported successfully!')
  }

  protected scrollToCards() {
    setTimeout(() => {
      this.cardsWrapper()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  toggleAll() {
    const allIds = this.cards().map((c) => c.id)
    this.selector.toggleAll(allIds)
  }
}
