import { Component, computed, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { Collection } from '@shared/types'
import { AnimDelay } from '../../../../directives/anim-delay'
import { BaseModalDirective } from '../base-modal-directive'

export type ConfirmCollectionAddType = {
  createName: string
  addToId: string
}

type CollectionVM = Collection & {
  cardsWillBeAddedCount: number
}

@Component({
  selector: 'app-collection-add-comp',
  imports: [ReactiveFormsModule, AnimDelay],
  templateUrl: './collection-add-comp.html',
  styleUrl: './collection-add-comp.scss'
})
export class CollectionAddComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)

  form = this._fb.group({
    createName: [''],
    addToId: ['']
  })

  collections = input.required<Collection[]>()
  cardIds = input.required<string[]>()

  collectionsVM = computed<CollectionVM[]>(() => {
    const cardIds = this.cardIds()
    const vm = this.collections().map((c) => ({
      ...c,
      cardsWillBeAddedCount: cardIds.filter((id) => !c.cardIds.includes(id)).length
    }))

    return vm
  })

  resetCollectionSelection() {
    this.form.patchValue({ addToId: '' })
  }
}
