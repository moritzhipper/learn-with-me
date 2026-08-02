import { Component, input } from '@angular/core'
import { BankShareViaDB } from '@shared/types'
import { LanguageMatch } from '../../language-match/language-match'
import { SharedBankStats } from '../shared-bank-stats/shared-bank-stats'

@Component({
  selector: 'liz-shared-bank-header',
  imports: [LanguageMatch, SharedBankStats],
  templateUrl: './shared-bank-header.html',
  styleUrl: './shared-bank-header.scss'
})
export class SharedBankHeader {
  bank = input.required<BankShareViaDB>()
}
