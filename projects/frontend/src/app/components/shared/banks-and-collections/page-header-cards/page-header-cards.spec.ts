import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PageHeaderCards } from './page-header-cards'

describe('PageHeaderCards', () => {
  let component: PageHeaderCards
  let fixture: ComponentFixture<PageHeaderCards>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderCards]
    }).compileComponents()

    fixture = TestBed.createComponent(PageHeaderCards)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
