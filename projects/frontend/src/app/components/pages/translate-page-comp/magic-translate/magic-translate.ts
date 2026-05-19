import { Component, computed, inject, input, output, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { AiService } from 'projects/frontend/src/app/services/ai/ai.service'
import { ModalService } from 'projects/frontend/src/app/services/modal-service'
import { ToastService } from 'projects/frontend/src/app/services/toast-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import {
  LearnableCreationConfig,
  LearnableFromTextCreationConfig
} from 'projects/frontend/src/app/types/types'
import { mapToStaggerVM, staggerDelays } from 'projects/frontend/src/app/utils/genaral-utils'
import { from, pipe, switchMap, tap } from 'rxjs'
import { Bubble } from '../../../shared/bubbles/bubble/bubble'
import { Bubbles } from '../../../shared/bubbles/bubbles'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'
import { LearnableComp } from '../../overview-page-comp/learnable-comp/learnable-comp'

@Component({
  selector: 'app-magic-translate',
  imports: [FormsModule, IconComp, RadioComp, ReactiveFormsModule, LearnableComp, Bubbles, Bubble],
  templateUrl: './magic-translate.html',
  styleUrl: './magic-translate.scss'
})
export class MagicTranslate {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly ls = inject(LearnablesStore)
  private readonly aiService = inject(AiService)
  private readonly toastService = inject(ToastService)
  private readonly modalService = inject(ModalService)

  protected readonly proposedCards = computed(() =>
    mapToStaggerVM(this.ls.activeBank().translations.magicTranslateCards)
  )
  protected readonly selectedCardsIds = signal<string[]>([])
  isConverting = signal(false)
  openQuickMode = output<void>()

  form = this._fb.group<
    Pick<LearnableCreationConfig, 'type'> & Pick<LearnableFromTextCreationConfig, 'text'>
  >({
    type: 'word',
    text: ''
  })

  protected imagePreview = signal<string | null>(null)
  protected formSignal = toSignal(this.form.valueChanges)

  protected readonly animdelays = staggerDelays(2)

  preset = input<string>()

  ngOnInit() {
    const preset = this.preset()
    if (preset) {
      this.form.patchValue({ text: preset })
    }
  }

  protected createLearnablesConfig = computed<LearnableCreationConfig | null>(() => {
    const language = this.ls.activeBank().language
    const form = this.formSignal()
    const type = form?.type

    if (!language || !type) return null

    const image = this.imagePreview()
    if (image) {
      return {
        source: 'image',
        image: image,
        type,
        language
      }
    }

    const text = form?.text
    if (text) {
      return {
        source: 'text',
        text,
        type,
        language
      }
    }

    return null
  })

  createLearnables = rxMethod<LearnableCreationConfig>(
    pipe(
      switchMap((config) => {
        this.isConverting.set(true)
        this.ls.setMagicTranslateCards([])
        return from(this.aiService.createLearnables(config)).pipe(
          tap(() => this.isConverting.set(false)),
          tapResponse({
            next: (learnables) => this.ls.setMagicTranslateCards(learnables),
            error: (e) => this.toastService.showHttpErrorToast(e)
          })
        )
      })
    )
  )

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview.set(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  translate() {
    const config = this.createLearnablesConfig()
    if (config) {
      this.createLearnables(config)
    } else {
      this.toastService.showToast({
        type: 'error',
        message: 'Please provide text or an image for translation.'
      })
    }
  }

  toggleSelection(cardId: string) {
    this.selectedCardsIds.update((ids) => {
      const isSet = ids.includes(cardId)
      if (isSet) {
        return ids.filter((id) => id !== cardId)
      } else {
        return [...ids, cardId]
      }
    })
  }

  isSelected(cardId: string) {
    return this.selectedCardsIds().includes(cardId)
  }

  resetSelection() {
    this.selectedCardsIds.set([])
  }

  async importCards() {
    const proposed = this.proposedCards()
    const selectedCards = proposed
      .map((p) => p.item)
      .filter((c) => this.selectedCardsIds().includes(c.id))

    if (!selectedCards.length) return
    const result = await this.modalService.open('confirm', {
      message: `Do you want to import ${selectedCards.length} cards?`
    })
    if (result.type === 'cancel') return
    this.ls.addLearnables(selectedCards)

    this.toastService.showToast('Cards imported successfully!')
  }
}
