import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SharedBankHeader } from './shared-bank-header'

describe('SharedBankHeader', () => {
  let component: SharedBankHeader
  let fixture: ComponentFixture<SharedBankHeader>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedBankHeader]
    }).compileComponents()

    fixture = TestBed.createComponent(SharedBankHeader)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
