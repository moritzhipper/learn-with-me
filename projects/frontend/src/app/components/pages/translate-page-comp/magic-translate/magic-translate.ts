import { Component, computed, inject, model, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { AiService } from 'projects/frontend/src/app/services/ai/ai.service'
import { ToastService } from 'projects/frontend/src/app/services/toast-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import { LearnableCreationConfig } from 'projects/frontend/src/app/types/types'
import { from, map, pipe, switchMap, tap } from 'rxjs'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

type FormType = Pick<LearnableCreationConfig, 'cardType' | 'sourceType'> & {
  textSource: string
}

@Component({
  selector: 'app-magic-translate',
  imports: [IconComp, RadioComp, ReactiveFormsModule],
  templateUrl: './magic-translate.html',
  styleUrl: './magic-translate.scss'
})
export class MagicTranslate {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly ls = inject(LearnablesStore)
  private readonly aiService = inject(AiService)
  private readonly toastService = inject(ToastService)

  isConverting = signal(false)

  form = this._fb.group<FormType>({
    cardType: 'word',
    sourceType: 'text',
    textSource: ''
  })

  protected imagePreview = signal<string | null>(null)

  protected formSignal = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue()
  })

  preset = model<string>()

  ngOnInit() {
    const preset = this.preset()
    if (preset) {
      this.form.patchValue({ sourceType: 'text', textSource: preset })
    }
  }

  protected createLearnablesConfig = computed<LearnableCreationConfig | null>(() => {
    const language = this.ls.activeBank().language
    const { cardType, sourceType, textSource } = this.formSignal()

    if (!language) return null

    const base: Pick<LearnableCreationConfig, 'language' | 'cardType'> = {
      language,
      cardType
    }

    const image = this.imagePreview()
    if (sourceType === 'image' && image) {
      return {
        sourceType: 'image',
        source: image,
        ...base
      }
    }

    if ((sourceType === 'text' || sourceType === 'prompt') && textSource) {
      return {
        sourceType,
        source: textSource,
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
}
