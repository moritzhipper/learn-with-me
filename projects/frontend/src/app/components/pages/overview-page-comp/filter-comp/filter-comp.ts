import { Component, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CollectionUser } from '@shared/types'
import {
  createAppearRange,
  mapToStaggerVM,
  StaggerVM
} from 'projects/frontend/src/app/utils/genaral-utils'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-filter-comp',
  imports: [IconComp, FormsModule],
  templateUrl: './filter-comp.html',
  styleUrl: './filter-comp.scss'
})
export class FilterComp {
  selectedCollectionId = model.required<string | null>()
  collections = input.required<StaggerVM<CollectionUser>, CollectionUser[]>({
    transform: mapToStaggerVM
  })

  protected delays = createAppearRange(1, 4)
}
