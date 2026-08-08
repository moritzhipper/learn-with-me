import { Component, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Collection } from '@shared/types'
import { AnimDelayWrapper } from '../../../../directives/anim-delay-wrapper'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

export type FilterAction = 'edit' | 'share' | 'download' | 'delete'

@Component({
  selector: 'app-filter-comp',
  imports: [IconComp, FormsModule, AnimDelayWrapper],
  templateUrl: './filter-comp.html',
  styleUrl: './filter-comp.scss',
  host: {
    class: 'full-width-scroll'
  }
})
export class FilterComp {
  selectedCollectionId = model.required<string | null>()
  collections = input.required<Collection[]>()

  onAction = output<FilterAction>()
}
