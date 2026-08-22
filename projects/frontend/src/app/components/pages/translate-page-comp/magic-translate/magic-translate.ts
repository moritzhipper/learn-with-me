import { Component, computed, inject, model, output, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { NgIcon } from '@ng-icons/core'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { LearnableBase } from '@shared/types'
import { from, map, pipe, switchMap, tap } from 'rxjs'
import { imageExtractIcon, magicIcon } from '../../../../icon-registry'
import { AiService } from '../../../../services/ai/ai.service'
import { ToastService } from '../../../../services/toast-service'
import { LearnablesStore } from '../../../../store/learnables-store'
import { LearnableCreationConfig } from '../../../../types/types'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

type FormType = {
  mode: 'extract' | 'generate'
  cardType: LearnableCreationConfig['cardType']
  source: string
}

@Component({
  selector: 'app-magic-translate',
  imports: [NgIcon, RadioComp, ReactiveFormsModule],
  templateUrl: './magic-translate.html',
  styleUrl: './magic-translate.scss'
})
export class MagicTranslate {
  protected readonly icons = {
    imageExtractIcon,
    magicIcon
  }
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly ls = inject(LearnablesStore)
  private readonly aiService = inject(AiService)
  private readonly toastService = inject(ToastService)

  newCardsCreated = output<void>()

  isConverting = signal(false)

  form = this._fb.group<FormType>({
    cardType: 'word',
    mode: 'extract',
    source: ''
  })

  protected imagePreview = signal<string | null>(null)

  protected formSignal = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue()
  })

  preset = model<string>()

  ngOnInit() {
    const preset = this.preset()
    if (preset) {
      this.form.patchValue({ mode: 'extract', source: preset })
    }
  }

  protected createLearnablesConfig = computed<LearnableCreationConfig | null>(() => {
    const language = this.ls.activeBank().language
    const tone = this.ls.activeBank().translations.tone
    const { cardType, mode, source } = this.formSignal()

    if (!language) return null

    const base: Pick<LearnableCreationConfig, 'language' | 'cardType' | 'tone'> = {
      language,
      cardType,
      tone
    }

    const image = this.imagePreview()
    if (mode === 'extract' && image) {
      return {
        sourceType: 'image',
        source: image,
        ...base
      }
    } else if (mode === 'extract' && source) {
      return {
        sourceType: 'text',
        source,
        ...base
      }
    } else if (mode === 'generate' && source) {
      return {
        sourceType: 'prompt',
        source,
        ...base
      }
    }

    return null
  })

  createLearnables = rxMethod<LearnableCreationConfig>(
    pipe(
      switchMap((config) => {
        this.isConverting.set(true)
        return from(this.aiService.createLearnables(config)).pipe(
          tap(() => this.isConverting.set(false)),
          tapResponse({
            next: (learnables) => this.cardCreationSuccess(learnables),
            error: (e) => this.toastService.showHttpErrorToast(e)
          })
        )
      })
    )
  )

  private cardCreationSuccess(learnable: LearnableBase[]) {
    this.ls.setMagicTranslateCards(learnable)
    this.newCardsCreated.emit()
  }

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
}
