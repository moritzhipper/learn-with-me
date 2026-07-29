import { DatePipe } from '@angular/common'
import { Component, computed, input, OnDestroy, output, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BankShareViaDB } from '@shared/types'
import { pluralize } from '../../../../utils/genaral-utils'
import { LanguageMatch } from '../../language-match/language-match'

type Counter = {
  cards: string
  words: string
  phrases: string
  collections: string
}

@Component({
  selector: 'a[app-shared-bank-comp]',
  imports: [DatePipe, LanguageMatch],
  templateUrl: './shared-bank-comp.html',
  styleUrls: ['../banks-and-collections.scss', './shared-bank-comp.scss'],
  hostDirectives: [RouterLink],
  host: {
    class: 'cards-stack-wrapper outline',
    '[class.small]': '!isCommunityBank()'
  }
})
export class SharedBankComp implements OnDestroy {
  bank = input.required<BankShareViaDB>()
  copyId = output<void>()
  importBank = output<void>()

  isCommunityBank = input<boolean>(false)

  protected readonly hasMultipleCollections = computed(() => this.bank().collections.length > 1)

  private readonly currentTime = signal(Date.now())

  private timeInterval = setInterval(() => {
    this.currentTime.set(Date.now())
  }, 1000)

  protected readonly counter = computed<Counter>(() => {
    const { collections, learnables } = this.bank()

    return {
      cards: pluralize(learnables.length, 'card'),
      words: pluralize(learnables.filter((l) => l.type === 'word').length, 'word'),
      phrases: pluralize(learnables.filter((l) => l.type === 'phrase').length, 'phrase'),
      collections: pluralize(collections.length, 'collection')
    }
  })

  // user browser relative time
  protected readonly ttl = computed(() => {
    const expiry = this.bank().expires

    if (!expiry) {
      return {
        label: 'never expires',
        isExpired: false
      }
    }

    const expires = new Date(expiry)
    const diffMs = expires.getTime() - this.currentTime()
    // If already expired
    if (diffMs <= 0) {
      return {
        label: 'expired',
        isExpired: true
      }
    }

    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    let ttlString = ''
    // More than a week: show the date
    if (diffDays > 7) {
      ttlString = expires.toLocaleDateString()
    } else if (diffDays > 0) {
      ttlString = pluralize(diffDays, 'day')
    } else if (diffHours > 0) {
      ttlString = pluralize(diffHours, 'hour')
    } else if (diffMinutes > 0) {
      ttlString = pluralize(diffMinutes, 'minute')
    } else {
      ttlString = pluralize(diffSeconds, 'second')
    }

    return {
      label: `expires in ${ttlString}`,
      isExpired: false
    }
  })

  ngOnDestroy(): void {
    clearInterval(this.timeInterval)
  }
}
