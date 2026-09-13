import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SwiperHints } from './swiper-hints'

describe('SwiperHints', () => {
  let component: SwiperHints
  let fixture: ComponentFixture<SwiperHints>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperHints]
    }).compileComponents()

    fixture = TestBed.createComponent(SwiperHints)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
