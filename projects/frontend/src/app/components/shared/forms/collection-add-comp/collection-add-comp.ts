import { Component, computed, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CollectionUser } from '@shared/types'
import { AnimDelay } from 'projects/frontend/src/app/services/anim-delay'
import { BaseModalDirective } from '../base-modal-directive'

export type ConfirmCollectionAddType = {
  createName?: string
  addToId?: string
}

type CollectionVM = CollectionUser & {
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

  collections = input.required<CollectionUser[]>()
  cardIds = input.required<string[]>()

  collectionsVM = computed<CollectionVM[]>(() => {
    const cardIds = this.cardIds()
    return this.collections().map((c) => ({
      ...c,
      cardsWillBeAddedCount: c.cardIds.filter((id) => cardIds.includes(id)).length
    }))
  })

  resetCollectionSelection() {
    this.form.patchValue({ addToId: '' })
  }
}
