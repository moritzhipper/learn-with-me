import { Component, inject, input, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { LanguageConfig } from '@shared/types'
import { LearnableCreationConfig } from 'projects/frontend/src/app/types_and_schemas/types'
import { AiService } from '../../../../services/ai/ai.service'
import { ToastService } from '../../../../services/toast-service'
import { IconComp } from '../../icon-comp/icon-comp'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-magic-add-comp',
  imports: [RadioComp, IconComp, ReactiveFormsModule],
  templateUrl: './magic-add-comp.html',
  styleUrl: './magic-add-comp.scss'
})
export class MagicAddComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly _aiS = inject(AiService)
  private toastService = inject(ToastService)

  language = input.required<LanguageConfig>()

  isConverting = signal(false)
  imagePreview = signal<string | null>(null)

  convertForm = this._fb.group({
    text: ['', Validators.required],
    type: 'words'
  })

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

  async convert(config: LearnableCreationConfig) {
    try {
      this.isConverting.set(true)
      const baseLearnables = await this._aiS.createLearnables(config)
      this.confirm(baseLearnables)
    } catch (error) {
      this.isConverting.set(false)
      const message = error instanceof Error ? error.message : 'Unknown error.'
      this.toastService.showToast({
        message,
        type: 'error'
      })

      console.error('Error creating learnables:', error)
    }
  }

  async onSubmit() {
    const formValue = this.convertForm.value
    const image = this.imagePreview()
    const text = formValue.text
    const type = formValue.type as LearnableCreationConfig['type']
    const language = this.language()
    if (!image && !text && !type) return

    if (text) {
      this.convert({
        type,
        language,
        source: 'text',
        text
      })
    } else if (image) {
      this.convert({
        type,
        language,
        source: 'image',
        image
      })
    }
  }

  removeImage() {
    this.imagePreview.set(null)
  }
}
