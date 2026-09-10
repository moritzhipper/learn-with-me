import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SwiperNav } from './swiper-nav'

describe('SwiperNav', () => {
  let component: SwiperNav
  let fixture: ComponentFixture<SwiperNav>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperNav]
    }).compileComponents()

    fixture = TestBed.createComponent(SwiperNav)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
