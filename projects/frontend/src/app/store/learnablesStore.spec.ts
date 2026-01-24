import { TestBed } from '@angular/core/testing'
import { LearnablesStore } from './learnablesStore'

describe('LearnablesStore', () => {
  let lStore = TestBed.inject(LearnablesStore)

  it('should be created', () => {
    expect(lStore).toBeTruthy()
  })

  it('should have initial state', () => {
    const activeBank = lStore.activeBank()
    expect(activeBank).toBeTruthy()
  }
})
