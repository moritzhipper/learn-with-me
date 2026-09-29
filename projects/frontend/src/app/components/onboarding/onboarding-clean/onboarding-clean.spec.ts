import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OnboardingClean } from './onboarding-clean'

describe('OnboardingClean', () => {
  let component: OnboardingClean
  let fixture: ComponentFixture<OnboardingClean>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingClean]
    }).compileComponents()

    fixture = TestBed.createComponent(OnboardingClean)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
