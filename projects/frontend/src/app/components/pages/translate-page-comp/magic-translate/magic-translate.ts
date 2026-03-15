import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LearnableBase } from '@shared/types'
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
  protected readonly proposedCards = signal<LearnableBase[]>([])

  form = this._fb.group({
    type: ['word'],
    text: ['']
  })

  imagePreview = signal<string | null>(null)

  formSignal = signal(this.form.valueChanges)

  protected createLearnablesConfig = computed(() => {
    // map form to config here

    return {}
  })

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
}
