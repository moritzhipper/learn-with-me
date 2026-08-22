import { Component, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  remixDonutChartFill,
  remixMagicFill,
  remixPencilFill,
  remixShareFill,
  remixTranslate
} from '@ng-icons/remixicon'
import { ModalService } from '../../../../services/modal-service'
import { LearnablesStore } from '../../../../store/learnables-store'
import { ConfirmationType } from '../../../shared/forms/bulk-add-comp/bulk-edit-comp'

type QuickLinkType = 'create' | 'community' | 'generate' | 'translate' | 'stats'

@Component({
  selector: 'liz-quick-links',
  imports: [RouterLink, NgIcon],
  providers: [
    provideIcons({
      remixTranslate,
      remixMagicFill,
      remixDonutChartFill,
      remixShareFill,
      remixPencilFill
    })
  ],
  templateUrl: './quick-links.html',
  styleUrl: './quick-links.scss'
})
export class QuickLinks {
  readonly types = input.required<QuickLinkType[]>()
  readonly ls = inject(LearnablesStore)
  readonly modalService = inject(ModalService)

  async createCards() {
    const result = await this.modalService.open<ConfirmationType>('bulk-edit')
    if (result.type !== 'confirm') return
    this.ls.importCards(result.value.add)
  }
}
