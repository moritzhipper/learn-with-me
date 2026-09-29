import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OnboardingViaShare } from './onboarding-via-share'

describe('OnboardingViaShare', () => {
  let component: OnboardingViaShare
  let fixture: ComponentFixture<OnboardingViaShare>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingViaShare]
    }).compileComponents()

    fixture = TestBed.createComponent(OnboardingViaShare)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
