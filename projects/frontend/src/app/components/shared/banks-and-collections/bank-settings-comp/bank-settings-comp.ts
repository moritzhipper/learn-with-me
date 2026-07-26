import { DatePipe } from '@angular/common'
import { Component, input, output } from '@angular/core'
import { BankUser } from '@shared/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { LanguageMatch } from '../../language-match/language-match'

@Component({
  selector: 'app-bank-settings-card',
  imports: [IconComp, DatePipe, LanguageMatch],
  templateUrl: './bank-settings-comp.html',
  styleUrls: ['../banks-and-collections.scss', './bank-settings-comp.scss'],
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
