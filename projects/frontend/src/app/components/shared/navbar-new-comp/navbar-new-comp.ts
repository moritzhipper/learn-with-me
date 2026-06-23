import { Component, computed, DOCUMENT, HostListener, inject, signal } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router'
import { config } from 'projects/frontend/src/config'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-navbar-new-comp',
  imports: [IconComp, RouterLink, RouterLinkActive],
  templateUrl: './navbar-new-comp.html',
  styleUrls: ['./navbar-new-comp.scss', './phone.scss', './desktop.scss']
})
export class NavbarNewComp {
  private body = inject(DOCUMENT).body

  protected readonly appName = config.appNameLong
  private readonly DIM_ON_PAGES = ['practice', 'translate']

  protected readonly ls = inject(LearnablesStore)
  protected readonly hasActivePractice = computed(() => !!this.ls.activeBank().practice.active)

  @HostListener('mouseleave', [])
  onleave() {
    if (!this.isMobileView) {
      this.isOpen.set(false)
    }
  }

  // delay closing via link click a bit to show active link change animation
  private readonly currentUrl$ = inject(Router).events.pipe(takeUntilDestroyed())

  currentUrl = toSignal(this.currentUrl$)

  protected readonly language = computed(() => this.ls.activeBank().language)
  protected readonly isOpen = signal(false)
  protected readonly isOnDimmablePage = signal(false)

  constructor() {
    this.currentUrl$.subscribe((ev) => {
      if (this.isMobileView) {
        this.isOpen.set(false)
      }
      if (ev instanceof NavigationEnd) {
        const isOnDimmable = this.DIM_ON_PAGES.some((page) => ev.urlAfterRedirects.includes(page))
        this.isOnDimmablePage.set(isOnDimmable)
      }
    })
  }

  toggle() {
    this.isOpen.set(!this.isOpen())
  }

  get isMobileView(): boolean {
    return this.body.offsetWidth <= 768
  }
}
