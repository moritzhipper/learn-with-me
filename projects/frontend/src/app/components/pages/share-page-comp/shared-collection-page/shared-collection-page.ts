import { Component, computed, inject, input, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { BankShareViaDB, Collection, LearnableBaseWithID } from '@shared/types'
import { ApiService } from '../../../../services/api-service'
import { ShareBanksService } from '../../../../services/share-banks-service'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { LanguageMatch } from '../../../shared/language-match/language-match'
import { PageHeaderComp } from '../../../shared/page-header-comp/page-header-comp'
import { LearnableComp } from '../../overview-page-comp/learnable-comp/learnable-comp'
import { PageWrapper } from '../../page-wrapper/page-wrapper'

@Component({
  selector: 'liz-shared-collection-page',
  imports: [PageWrapper, PageHeaderComp, IconComp, LearnableComp, LanguageMatch],
  templateUrl: './shared-collection-page.html',
  styleUrl: './shared-collection-page.scss'
})
export class SharedCollectionPage {
  private readonly apiS = inject(ApiService)
  private readonly shareBankS = inject(ShareBanksService)

  // from url
  id = input.required<string>()

  bank = rxResource({
    params: this.id,
    stream: ({ params }) => this.apiS.getBankByID(params)
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
