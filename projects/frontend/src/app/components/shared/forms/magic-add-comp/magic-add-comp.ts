import { Component, inject, input, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { LanguageConfig } from '@shared/types'
import { AiService } from '../../../../services/ai/ai.service'
import { ToastService } from '../../../../services/toast-service'
import { BaseLearnableCreationConfig } from '../../../../types_and_schemas/types'
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

  async convert() {
    const formValue = this.convertForm.value
    const imagePreview = this.imagePreview()
    const text = formValue.text
    if (!imagePreview && !text) return

    const creationConf = {
      type: formValue.type,
      language: this.language()
    } as BaseLearnableCreationConfig

    try {
      this.isConverting.set(true)
      if (text) {
        const baseLearnables = await this._aiS.createLearnablesFromString({
          ...creationConf,
          text
        })
        this.confirm(baseLearnables)
      } else if (imagePreview) {
        const baseLearnables = await this._aiS.createLearnablesFromImage({
          ...creationConf,
          image: imagePreview
        })
        this.confirm(baseLearnables)
      }
    } catch (error) {
      this.isConverting.set(false)
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.toastService.showToast({
        message,
        type: 'error'
      })

      console.error('Error creating learnables:', error)
    }
  }

  removeImage() {
    this.imagePreview.set(null)
  }
}
