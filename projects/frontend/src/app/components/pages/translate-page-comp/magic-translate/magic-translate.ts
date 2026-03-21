import { Component, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { tapResponse } from '@ngrx/operators'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { LearnableBase } from '@shared/types'
import { AiService } from 'projects/frontend/src/app/services/ai/ai.service'
import { ToastService } from 'projects/frontend/src/app/services/toast-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnablesStore'
import { LearnableCreationConfig } from 'projects/frontend/src/app/types_and_schemas/types'
import { mapToStaggerVM, StaggerVM } from 'projects/frontend/src/app/utils/genaral-utils'
import { EMPTY, from, pipe, switchMap } from 'rxjs'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'
import { LearnableComp } from '../../overview-page-comp/learnable-comp/learnable-comp'

@Component({
  selector: 'app-magic-translate',
  imports: [FormsModule, IconComp, RadioComp, ReactiveFormsModule, LearnableComp],
  templateUrl: './magic-translate.html',
  styleUrl: './magic-translate.scss'
})
export class MagicTranslate {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly ls = inject(LearnablesStore)
  protected readonly proposedCards = signal<StaggerVM<LearnableBase>>([])
  private readonly aiService = inject(AiService)
  private readonly toastService = inject(ToastService)

  form = this._fb.group({
    type: ['word'],
    text: ['']
  })

  imagePreview = signal<string | null>(null)

  formSignal = toSignal(this.form.valueChanges)

  protected createLearnablesConfig = computed<LearnableCreationConfig | null>(() => {
    const language = this.ls.activeBank().language
    if (!language) return null

    const imagePreview = this.imagePreview()
    if (imagePreview) {
      return {
        source: 'image',
        image: imagePreview,
        type: 'both',
        language
      }
    }

    const form = this.formSignal()
    if (form?.text && form?.type) {
      return {
        source: 'text',
        text: form.text,
        type: form.type as LearnableCreationConfig['type'],
        language
      }
    }

    return null
  })

  createLearnables = rxMethod<LearnableCreationConfig | null>(
    pipe(
      switchMap((config) => {
        if (!config) {
          this.proposedCards.set([])
          return EMPTY
        }

        return from(this.aiService.createLearnables(config)).pipe(
          tapResponse({
            next: (learnables) => this.proposedCards.set(mapToStaggerVM(learnables)),
            error: (e) => this.toastService.showHttpErrorToast(e)
          })
        )
      })
    )
  )

  removeImage() {
    this.imagePreview.set(null)
  }

  // create two rxMetho
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
      this.createLearnables(this.createLearnablesConfig())
    } else {
      this.toastService.showToast({
        type: 'error',
        message: 'Please provide text or an image for translation.'
      })
    }
  }
}
