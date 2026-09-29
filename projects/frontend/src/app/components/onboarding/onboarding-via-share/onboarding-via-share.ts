import { Component, input } from '@angular/core'

@Component({
  selector: 'liz-onboarding-via-share',
  imports: [],
  templateUrl: './onboarding-via-share.html',
  styleUrl: './onboarding-via-share.scss'
})
export class OnboardingViaShare {
  readonly page = input<number>(0)
}
