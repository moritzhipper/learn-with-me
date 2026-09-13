import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SwiperPageLayout } from './swiper-page-layout'

describe('SwiperPageLayout', () => {
  let component: SwiperPageLayout
  let fixture: ComponentFixture<SwiperPageLayout>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperPageLayout]
    }).compileComponents()

    fixture = TestBed.createComponent(SwiperPageLayout)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
