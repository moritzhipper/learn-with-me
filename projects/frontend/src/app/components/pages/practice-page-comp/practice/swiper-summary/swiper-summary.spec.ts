import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SwiperSummary } from './swiper-summary'

describe('SwiperSummary', () => {
  let component: SwiperSummary
  let fixture: ComponentFixture<SwiperSummary>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperSummary]
    }).compileComponents()

    fixture = TestBed.createComponent(SwiperSummary)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
