import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PracticeActive, UserLearnable } from '@shared/types'

@Component({
  selector: 'app-practice-card-comp',
  imports: [FormsModule],
  templateUrl: './practice-card-comp.html',
  styleUrl: './practice-card-comp.scss',
  host: {
    '[class.concealed]': 'concealed()'
  }
})
export class PracticeCardComp {
  concealed = input<boolean>(true)
  learnable = input.required<UserLearnable>()
  direction = input.required<PracticeActive['direction']>()
  updateNotes = output<{ id: string; newNotes: string }>()
  allowEdit = input<boolean>(false)

  private readonly textArea = viewChild.required<ElementRef<HTMLTextAreaElement>>('textArea')

  setUpdatedNotes(newNotes: string) {
    this.updateNotes.emit({ id: this.learnable().id, newNotes })
  }

  constructor() {
    effect(() => {
      if (this.allowEdit()) {
        setTimeout(() => {
          this.textArea().nativeElement.focus()
        }, 300)
      }
    })
  }
}
