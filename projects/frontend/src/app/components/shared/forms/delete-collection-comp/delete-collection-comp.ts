import { Component, inject } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { AnimDelayWrapper } from '../../../../directives/anim-delay-wrapper'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type ConfirmCollectionDeletionType = {
  deletionType: 'dissolve' | 'remove'
}

@Component({
  selector: 'app-delete-collection-comp',
  imports: [ReactiveFormsModule, RadioComp, AnimDelayWrapper],
  templateUrl: './delete-collection-comp.html',
  styleUrl: './delete-collection-comp.scss'
})
export class DeleteCollectionComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)

  form = this._fb.group<ConfirmCollectionDeletionType>({
    deletionType: 'dissolve'
  })
}
