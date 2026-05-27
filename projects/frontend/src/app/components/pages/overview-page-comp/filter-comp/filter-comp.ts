import { Component, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CollectionUser } from '@shared/types'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import {
  mapToStaggerVM,
  staggerDelays,
  StaggerVM
} from 'projects/frontend/src/app/utils/genaral-utils'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

export type FilterAction = 'edit' | 'share' | 'download' | 'delete'

@Component({
  selector: 'app-filter-comp',
  imports: [IconComp, FormsModule, AnimDelay],
  templateUrl: './filter-comp.html',
  styleUrl: './filter-comp.scss'
})
export class FilterComp {
  selectedCollectionId = model.required<string | null>()
  collections = input.required<StaggerVM<CollectionUser>, CollectionUser[]>({
    transform: mapToStaggerVM
  })

  protected readonly delays = staggerDelays(4)

  onAction = output<FilterAction>()
}
