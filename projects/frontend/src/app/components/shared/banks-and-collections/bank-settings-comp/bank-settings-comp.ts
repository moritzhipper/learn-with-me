import { DatePipe } from '@angular/common'
import { Component, input, output } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { BankUser } from '@shared/types'
import { shareIcon } from '../../../../icon-registry'
import { LanguageMatch } from '../../language-match/language-match'

@Component({
  selector: 'app-bank-settings-card',
  imports: [NgIcon, DatePipe, LanguageMatch],
  templateUrl: './bank-settings-comp.html',
  styleUrls: ['./bank-settings-comp.scss'],

  host: {
    class: 'cards-stack-wrapper outline'
  }
})
export class BankSettingsComp {
  protected readonly shareIcon = shareIcon
  bank = input.required<BankUser>()
  isActive = input.required<boolean>()
  share = output<void>()

  edit = output<void>()
  setActive = output<void>()
  delete = output<void>()
  download = output<void>()
}
