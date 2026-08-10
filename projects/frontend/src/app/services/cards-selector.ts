import { computed, Injectable, signal } from '@angular/core'

@Injectable()
export class CardsSelector {
  private _selectedCards = signal<Set<string>>(new Set())
  readonly selected = this._selectedCards.asReadonly()
  readonly isEmpty = computed(() => this._selectedCards().size === 0)

  toggle(id: string) {
    this._selectedCards.update((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  toggleAll(allIds: string[]) {
    const count = this._selectedCards().size
    if (count !== allIds.length) {
      this.select(allIds)
    } else if (count === allIds.length) {
      this.reset()
    }
  }

  select(selection: string | string[]) {
    this._selectedCards.update((prev) => {
      const selections = Array.isArray(selection) ? selection : [selection]
      const newSet = new Set(prev)

      selections.forEach((id) => {
        newSet.add(id)
      })

      return newSet
    })
  }

  reset() {
    this._selectedCards.set(new Set())
  }
}
