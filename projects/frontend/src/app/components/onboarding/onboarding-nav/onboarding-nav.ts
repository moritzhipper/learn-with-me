import { Component, input, model } from '@angular/core'

@Component({
  selector: 'liz-onboarding-nav',
  imports: [],
  templateUrl: './onboarding-nav.html',
  styleUrl: './onboarding-nav.scss'
})
export class OnboardingNav {
  protected labelNext = input<string>('Next')
  readonly pageCount = input.required<number>()
  readonly activePage = model<number>(0)

  next() {
    const page = this.activePage()

    if (page < this.pageCount() - 1) {
      this.activePage.set(page + 1)
    } else if (page === this.pageCount() - 1) {
      console.log('redirect here')
    }
  }
  back() {
    const page = this.activePage()

    if (page > 0) {
      this.activePage.set(page - 1)
    }
  }
}
