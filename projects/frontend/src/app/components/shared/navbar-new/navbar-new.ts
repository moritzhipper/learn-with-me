import { Component, computed, DOCUMENT, HostListener, inject, signal } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { config } from '../../../../config'
import {
  dashboardPageIcon,
  infoIcon,
  languageSwapIcon,
  navigationMenuIcon,
  practicePageIcon,
  settingsPageIcon,
  translatePageIcon
} from '../../../icon-registry'
import { LearnablesStore } from '../../../store/learnables-store'

@Component({
  selector: 'app-navbar-new',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  templateUrl: './navbar-new.html',
  styleUrls: ['./navbar-new.scss']
})
export class NavbarNew {
  private body = inject(DOCUMENT).body

  protected readonly appName = config.appNameLong
  protected readonly icons = {
    aboutPageIcon: infoIcon,
    dashboardPageIcon,
    languageSwapIcon,
    navigationMenuIcon,
    practicePageIcon,
    settingsPageIcon,
    translatePageIcon
  }
  private readonly DIM_ON_PAGES = ['practice', 'translate']

  protected readonly ls = inject(LearnablesStore)
  protected readonly hasActivePractice = computed(() => !!this.ls.activeBank().practice.active)

  @HostListener('mouseleave', [])
  protected onleave() {
    if (!this.isMobileView) {
      this.isOpen.set(false)
    }
  }

  // delay closing via link click a bit to show active link change animation
  private readonly currentUrl$ = inject(Router).events.pipe(takeUntilDestroyed())

  currentUrl = toSignal(this.currentUrl$)

  protected readonly language = computed(() => this.ls.activeBank().language)
  readonly isOpen = signal(false)
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
    this.isOpen.update((v) => !v)
  }

  get isMobileView(): boolean {
    return this.body.offsetWidth <= 768
  }
}
