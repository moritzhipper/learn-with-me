import { Component, input } from '@angular/core'

@Component({
  selector: 'liz-onboarding-clean',
  imports: [],
  templateUrl: './onboarding-clean.html',
  styleUrl: './onboarding-clean.scss'
})
export class OnboardingClean {
  readonly page = input<number>(0)
}
