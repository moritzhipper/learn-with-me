import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OnboardingNav } from './onboarding-nav'

describe('OnboardingNav', () => {
  let component: OnboardingNav
  let fixture: ComponentFixture<OnboardingNav>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingNav]
    }).compileComponents()

    fixture = TestBed.createComponent(OnboardingNav)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
