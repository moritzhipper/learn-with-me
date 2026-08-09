import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SharedBankPage } from './shared-bank-page'

describe('SharedCollectionPage', () => {
  let component: SharedBankPage
  let fixture: ComponentFixture<SharedBankPage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedBankPage]
    }).compileComponents()

    fixture = TestBed.createComponent(SharedBankPage)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
