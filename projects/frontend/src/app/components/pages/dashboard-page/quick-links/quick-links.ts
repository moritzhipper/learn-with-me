import { Component, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ModalService } from 'projects/frontend/src/app/services/modal-service'
import { LearnablesStore } from 'projects/frontend/src/app/store/learnables-store'
import { ConfirmationType } from '../../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

type QuickLinkType = 'create' | 'community' | 'generate' | 'translate' | 'stats'

@Component({
  selector: 'liz-quick-links',
  imports: [IconComp, RouterLink],
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
