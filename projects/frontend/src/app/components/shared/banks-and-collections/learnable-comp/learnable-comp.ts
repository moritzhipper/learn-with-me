import { DatePipe } from '@angular/common'
import { Component, computed, input } from '@angular/core'
import { LearnableWithId, UserLearnable } from '@shared/types'

@Component({
  selector: '[app-learnable-comp], app-learnable-comp',
  imports: [DatePipe],
  templateUrl: './learnable-comp.html',
  styleUrl: './learnable-comp.scss',
  host: {
    '[class.small-text]': 'hasManyLetters()',
    '[class.selected]': 'isSelected()'
  }
})
export class LearnableComp {
  learnable = input.required<UserLearnable | LearnableWithId>()
  isSelected = input<boolean>(false)

  protected hasManyLetters = computed(() => {
    const lexemeLengt = this.learnable().lexeme.length
    const translationLength = this.learnable().translation.length
    const notesLength = this.learnable().notes.length
    const sum = lexemeLengt + translationLength + notesLength
    return sum > 150
  })
}
