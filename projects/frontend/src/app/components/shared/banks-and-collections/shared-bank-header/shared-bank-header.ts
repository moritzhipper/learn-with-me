import { Component, input } from '@angular/core'
import { BankShareViaDB } from '@shared/types'
import { HeaderLink } from '../../header-link/header-link'
import { LanguageMatch } from '../../language-match/language-match'
import { SharedBankStats } from '../shared-bank-stats/shared-bank-stats'

@Component({
  selector: 'liz-shared-bank-header',
  imports: [LanguageMatch, SharedBankStats, HeaderLink],
  templateUrl: './shared-bank-header.html',
  styleUrls: ['./shared-bank-header.scss', '../banks-and-collections.scss'],
  host: {
    class: 'header outline'
  }
})
export class SharedBankHeader {
  bank = input.required<BankShareViaDB>()
}
