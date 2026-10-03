import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ModalOutletComp } from './components/shared/forms/modal-wrapper-comp/modal-outlet'
import { NavbarNew } from './components/shared/navbar-new/navbar-new'
import { ToastOutletComp } from './components/shared/toast-outlet-comp/toast-outlet-comp'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastOutletComp, ModalOutletComp, NavbarNew],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
