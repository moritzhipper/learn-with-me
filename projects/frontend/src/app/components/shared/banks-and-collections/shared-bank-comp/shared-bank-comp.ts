import { DatePipe } from '@angular/common'
import { booleanAttribute, Component, computed, input } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { BankShareViaDB } from '@shared/types'
import { interval, map } from 'rxjs'
import { dateToTTLTerm } from '../../../../utils/genaral-utils'
import { LanguageMatch } from '../../language-match/language-match'
import { SharedBankStats } from '../shared-bank-stats/shared-bank-stats'

type Counter = {
  cards: string
  words: string
  phrases: string
  collections: string
}

@Component({
  selector: 'app-shared-bank-comp',
  imports: [DatePipe, LanguageMatch, SharedBankStats],
  templateUrl: './shared-bank-comp.html',
  styleUrls: ['./shared-bank-comp.scss']
})
export class SharedBankComp {
  bank = input.required<BankShareViaDB>()
  communityBank = input(false, { transform: booleanAttribute })

  private readonly currentTime = toSignal(interval(1000).pipe(map(() => Date.now())), {
    initialValue: Date.now()
  })

  protected readonly ttl = computed(() => dateToTTLTerm(this.bank().expires, this.currentTime()))
}
