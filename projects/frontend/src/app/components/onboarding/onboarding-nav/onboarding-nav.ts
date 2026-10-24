import { Component, input, model, output } from '@angular/core'

@Component({
  selector: 'liz-onboarding-nav',
  imports: [],
  templateUrl: './onboarding-nav.html',
  styleUrl: './onboarding-nav.scss'
})
export class OnboardingNav {
  readonly pageCount = input.required<number>()
  readonly activePage = model<number>(0)
  readonly labels = input<string[]>([])
  readonly done = output()
  readonly disableNext = input<boolean>(false)

  next() {
    const page = this.activePage()

    if (page < this.pageCount() - 1) {
      this.activePage.set(page + 1)
    } else if (page === this.pageCount() - 1) {
      this.done.emit()
    }
  }

  back() {
    const page = this.activePage()

    if (page > 0) {
      this.activePage.set(page - 1)
    }
  }
}
