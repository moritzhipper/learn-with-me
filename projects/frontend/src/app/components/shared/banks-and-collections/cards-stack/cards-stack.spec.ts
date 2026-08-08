import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CardsStack } from './cards-stack'

describe('CardsStack', () => {
  let component: CardsStack
  let fixture: ComponentFixture<CardsStack>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsStack]
    }).compileComponents()

    fixture = TestBed.createComponent(CardsStack)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
