import { Component, computed, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { tapResponse } from '@ngrx/operators'
import { filter, map, switchMap } from 'rxjs'
import z from 'zod'
import { config } from '../config'
import { ModalWrapperComp } from './components/shared/forms/modal-wrapper-comp/modal-wrapper-comp'
import { NavbarNewComp } from './components/shared/navbar-new-comp/navbar-new-comp'
import { NavbarNew } from './components/shared/navbar-new/navbar-new'
import { OnboardingComp } from './components/shared/onboarding-comp/onboarding-comp'
import { ToastOutletComp } from './components/shared/toast-outlet-comp/toast-outlet-comp'
import { ApiService } from './services/api-service'
import { ShareBanksService } from './services/share-banks-service'
import { ToastService } from './services/toast-service'
import { LearnablesStore } from './store/learnables-store'

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastOutletComp,
    ModalWrapperComp,
    NavbarNewComp,
    OnboardingComp,
    NavbarNew
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private route = inject(ActivatedRoute)

  private readonly _lStore = inject(LearnablesStore)
  private readonly apiS = inject(ApiService)
  private readonly toastS = inject(ToastService)
  private readonly bankService = inject(ShareBanksService)

  protected readonly hasBank = computed(() => this._lStore.banks().length > 0)

  private params = this.route.queryParams.pipe(
    takeUntilDestroyed(),
    map((params) => params[config.bankIDParamName]),
    filter((id) => z.uuid().safeParse(id).success),
    switchMap((id) =>
      this.apiS.getBankByID(id).pipe(
        tapResponse({
          next: this.bankService.importOnlineBank.bind(this.bankService),
          error: this.resolveBankError.bind(this)
        })
      )
    )
  )

  constructor() {
    this.params.subscribe()
  }

  resolveBankError() {
    this.toastS.showToast({
      header: 'Error',
      message: 'The shared Bank could not be found.',
      type: 'error'
    })
  }
}
