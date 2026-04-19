import { inject, Injectable } from '@angular/core'
import { Practice } from '@shared/types'
import { LearnablesStore } from '../../store/learnablesStore'

type SeedDebugBankConfig = {
  name: string
  collectionConfig: {
    name: string
    cardCount: number
  }[]
  practiceConfig: {
    type: Practice['type']
    daysAgo: number
  }[]
}

const defaultDebugConfig: SeedDebugBankConfig = {
  name: 'Debug Bank',
  collectionConfig: [
    {
      name: 'Collection 1',
      cardCount: 10
    },
    {
      name: 'Collection 2',
      cardCount: 20
    }
  ],
  practiceConfig: [
    {
      type: 'collection',
      daysAgo: 1
    },
    {
      type: 'collection',
      daysAgo: 2
    },
    {
      type: 'collection',
      daysAgo: 10
    }
  ]
}

@Injectable({
  providedIn: 'root'
})
export class DebugHelper {
  private readonly ls = inject(LearnablesStore)

  seedDebugBank() {}
}
