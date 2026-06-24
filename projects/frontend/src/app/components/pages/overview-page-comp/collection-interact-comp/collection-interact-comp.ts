import { Component, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Collection } from '@shared/types'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-collection-interact-comp',
  imports: [IconComp, FormsModule, AnimDelay],
  templateUrl: './collection-interact-comp.html',
  styleUrl: './collection-interact-comp.scss'
})
export class CollectionInteractComp {
  selectableCollections = input.required<Collection[]>()
  selectedCollectionId = model.required<string | null>()

  edit = output<void>()
  delete = output<void>()
  share = output<void>()
  download = output<void>()
}
