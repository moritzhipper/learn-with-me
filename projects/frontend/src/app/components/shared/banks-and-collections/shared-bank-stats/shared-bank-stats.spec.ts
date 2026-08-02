import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SharedBankStats } from './shared-bank-stats'

describe('SharedBankStats', () => {
  let component: SharedBankStats
  let fixture: ComponentFixture<SharedBankStats>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedBankStats]
    }).compileComponents()

    fixture = TestBed.createComponent(SharedBankStats)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
