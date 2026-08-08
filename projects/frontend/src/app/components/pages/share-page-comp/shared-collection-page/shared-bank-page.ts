import { Component, computed, inject, input, signal } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { BankShareViaDB, Collection, LearnableBaseWithID } from '@shared/types'
import { interval, map } from 'rxjs'
import { AnimDelayWrapper } from '../../../../directives/anim-delay-wrapper'
import { ApiService } from '../../../../services/api-service'
import { ShareBanksService } from '../../../../services/share-banks-service'
import { dateToTTLTerm } from '../../../../utils/genaral-utils'
import { PageHeaderCards } from '../../../shared/banks-and-collections/page-header-cards/page-header-cards'
import { SharedBankStats } from '../../../shared/banks-and-collections/shared-bank-stats/shared-bank-stats'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { LanguageMatch } from '../../../shared/language-match/language-match'
import { LearnableComp } from '../../overview-page-comp/learnable-comp/learnable-comp'
import { PageWrapper } from '../../page-wrapper/page-wrapper'

@Component({
  selector: 'liz-shared-bank-page',
  imports: [PageWrapper, AnimDelayWrapper, IconComp, LearnableComp, PageHeaderCards, SharedBankStats, LanguageMatch],
  templateUrl: './shared-bank-page.html',
  styleUrl: './shared-bank-page.scss',

})
export class SharedBankPage {
  private readonly apiS = inject(ApiService)
  private readonly shareBankS = inject(ShareBanksService)

  // from url
  id = input.required<string>()

  bank = rxResource({
    params: this.id,
    stream: ({ params }) => this.apiS.getBankByID(params)
  })

  private readonly currentTime = toSignal(interval(1000).pipe(map(() => Date.now())), {
    initialValue: Date.now()
  })

  protected readonly ttl = computed(() => {
    const expires = this.bank.hasValue() ? this.bank.value().expires : null
    return dateToTTLTerm(expires, this.currentTime())
  })

  protected selectedCollection = signal<Collection | null>(null)

  visibleCards = computed<LearnableBaseWithID[]>(() => {
    const bank = this.bank
    const collection = this.selectedCollection()
    if (!bank.hasValue()) return []
    if (!collection) return bank.value().learnables
    return bank.value().learnables.filter((card) => collection.cardIds.includes(card.id))
  })

  download(bank: BankShareViaDB) {
    this.apiS.increaseBankDownloadCount(bank.id)

    alert('Available soon')
    // this.shareBankS.exportBank(bank)
  }

  import(bank: BankShareViaDB) {
    this.shareBankS.importOnlineBank(bank)
    this.apiS.increaseBankDownloadCount(bank.id)
  }

  copyLink(bank: BankShareViaDB) {
    this.shareBankS.copyLinkToClipboard(bank.id, bank.name)
  }
}
