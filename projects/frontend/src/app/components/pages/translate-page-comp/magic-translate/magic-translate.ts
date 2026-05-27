import { Component, computed, inject, model, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { AiService } from 'projects/frontend/src/app/services/ai/ai.service'
import { ToastService } from 'projects/frontend/src/app/services/toast-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import {
  LearnableCreationConfig,
  LearnableFromTextCreationConfig
} from 'projects/frontend/src/app/types/types'
import { from, pipe, switchMap, tap } from 'rxjs'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

@Component({
  selector: 'app-magic-translate',
  imports: [FormsModule, IconComp, RadioComp, ReactiveFormsModule],
  templateUrl: './magic-translate.html',
  styleUrl: './magic-translate.scss'
})
export class MagicTranslate {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly ls = inject(LearnablesStore)
  private readonly aiService = inject(AiService)
  private readonly toastService = inject(ToastService)

  protected readonly selectedCardsIds = signal<string[]>([])
  isConverting = signal(false)

  form = this._fb.group<
    Pick<LearnableCreationConfig, 'type'> & Pick<LearnableFromTextCreationConfig, 'text'>
  >({
    type: 'word',
    text: ''
  })

  protected imagePreview = signal<string | null>(null)
  protected formSignal = toSignal(this.form.valueChanges)

  preset = model<string>()

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
}
