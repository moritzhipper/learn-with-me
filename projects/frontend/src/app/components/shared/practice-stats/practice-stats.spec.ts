import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PracticeStats } from './practice-stats'

describe('PracticeStats', () => {
  let component: PracticeStats
  let fixture: ComponentFixture<PracticeStats>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeStats]
    }).compileComponents()

    fixture = TestBed.createComponent(PracticeStats)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
