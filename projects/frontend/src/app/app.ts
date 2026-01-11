import { Component, computed, DOCUMENT, HostListener, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { tapResponse } from '@ngrx/operators'
import { BankShareViaDB } from '@shared/types'
import { filter, map, switchMap } from 'rxjs'
import z from 'zod'
import { config } from '../config'
import { ModalWrapperComp } from './components/shared/forms/modal-wrapper-comp/modal-wrapper-comp'
import { NavbarNewComp } from './components/shared/navbar-new-comp/navbar-new-comp'
import { OnboardingComp } from './components/shared/onboarding-comp/onboarding-comp'
import { ToastOutletComp } from './components/shared/toast-outlet-comp/toast-outlet-comp'
import { ApiService } from './services/api-service'
import { ModalService } from './services/modal-service'
import { ToastService } from './services/toast-service'
import { LearnablesStore } from './store/learnablesStore'

type PageConfig = {
  icon: string
  title: string
  mode: 'full' | 'compact'
}

const DEFAULT_PAGE_CONFIG: PageConfig = {
  icon: 'page',
  mode: 'compact',
  title: ''
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastOutletComp, ModalWrapperComp, NavbarNewComp, OnboardingComp],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private route = inject(ActivatedRoute)

  private readonly _lStore = inject(LearnablesStore)
  private readonly apiS = inject(ApiService)
  private readonly modalService = inject(ModalService)
  private readonly toastS = inject(ToastService)

  protected readonly hasBank = computed(() => this._lStore.banks().length > 0)

  private document = inject(DOCUMENT)

  private params = this.route.queryParams.pipe(
    takeUntilDestroyed(),
    map((params) => params[config.bankIDParamName]),
    filter((id) => z.uuid().safeParse(id).success),
    switchMap((id) =>
      this.apiS.getBankByID(id).pipe(
        tapResponse({
          next: this.resolveBankSuccess.bind(this),
          error: this.resolveBankError.bind(this)
        })
      )
    )
  )

  @HostListener('window:resize')
  onResize() {
    this.setBodyHeight()
  }

  @HostListener('window:load')
  onLoad() {
    this.setBodyHeight()
  }

  constructor() {
    this.params.subscribe()
    setTimeout(() => this.setBodyHeight(), 1000)
  }

  setBodyHeight() {
    this.document.body.style.setProperty('--app-height', `${window.innerHeight}px`)
  }

  async resolveBankSuccess(bank: BankShareViaDB) {
    const answer = await this.modalService.open('bank-import', { bank })
    if (answer.type !== 'confirm') return
    this._lStore.importBankExport(bank)
  }

  resolveBankError() {
    this.toastS.showToast({
      header: 'Error',
      message: 'The shared bank could not be found',
      type: 'error'
    })
  }
}
