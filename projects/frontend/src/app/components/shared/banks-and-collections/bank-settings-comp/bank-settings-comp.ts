import { DatePipe } from '@angular/common'
import { Component, input, output } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixShareFill } from '@ng-icons/remixicon'
import { BankUser } from '@shared/types'
import { LanguageMatch } from '../../language-match/language-match'

@Component({
  selector: 'app-bank-settings-card',
  imports: [NgIcon, DatePipe, LanguageMatch],
  providers: [provideIcons({ remixShareFill })],
  templateUrl: './bank-settings-comp.html',
  styleUrls: ['./bank-settings-comp.scss'],

  host: {
    class: 'cards-stack-wrapper outline'
  }
})
export class BankSettingsComp {
  bank = input.required<BankUser>()
  isActive = input.required<boolean>()
  share = output<void>()

  edit = output<void>()
  setActive = output<void>()
  delete = output<void>()
  download = output<void>()
}
