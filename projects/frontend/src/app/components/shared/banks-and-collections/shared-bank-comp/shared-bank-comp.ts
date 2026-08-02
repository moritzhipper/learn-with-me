import { DatePipe } from '@angular/common'
import { Component, computed, input } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
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
  selector: '[app-shared-bank-comp]',
  imports: [DatePipe, LanguageMatch, SharedBankStats],
  templateUrl: './shared-bank-comp.html',
  styleUrls: ['../banks-and-collections.scss', './shared-bank-comp.scss'],
  hostDirectives: [RouterLink],
  host: {
    class: 'cards-stack-wrapper outline',
    '[class.community]': '!isCommunityBank()'
  }
})
export class SharedBankComp {
  bank = input.required<BankShareViaDB>()
  isCommunityBank = input<boolean>(false)

  private readonly currentTime = toSignal(interval(1000).pipe(map(() => Date.now())), {
    initialValue: Date.now()
  })
  protected readonly ttl = computed(() => dateToTTLTerm(this.bank().expires, this.currentTime()))
}
