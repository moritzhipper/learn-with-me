import { DatePipe } from '@angular/common'
import { Component, computed, input, output } from '@angular/core'
import { LearnableBase, UserLearnable } from '@shared/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-learnable-comp',
  imports: [DatePipe, IconComp],
  templateUrl: './learnable-comp.html',
  styleUrl: './learnable-comp.scss',
  host: {}
})
export class LearnableComp {
  learnable = input.required<UserLearnable | LearnableBase>()
  showNewBadge = input<boolean>(false)
  isSelected = input<boolean>(false)
  onSelect = output<void>()
  hasManyLetters = computed(() => {
    const lexemeLengt = this.learnable().lexeme.length
    const translationLength = this.learnable().translation.length
    const notesLength = this.learnable().notes.length
    const sum = lexemeLengt + translationLength + notesLength
    return sum > 150
  })
}
