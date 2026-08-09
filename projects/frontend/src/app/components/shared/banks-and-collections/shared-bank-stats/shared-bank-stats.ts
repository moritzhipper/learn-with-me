import { DatePipe } from '@angular/common'
import { booleanAttribute, Component, computed, input } from '@angular/core'
import { BankShareViaDB } from '@shared/types'

@Component({
  selector: 'liz-shared-bank-stats',
  imports: [DatePipe],
  templateUrl: './shared-bank-stats.html',
  styleUrl: './shared-bank-stats.scss'
})
export class SharedBankStats {
  bank = input.required<BankShareViaDB>()
  hideCounts = input(false, { transform: booleanAttribute })
  hideGeneral = input(false, { transform: booleanAttribute })

  protected counts = computed(() => {
    const words = this.bank().learnables.filter((l) => l.type === 'word').length
    const phrases = this.bank().learnables.filter((l) => l.type === 'phrase').length

    return {
      words,
      phrases
    }
  })
}
