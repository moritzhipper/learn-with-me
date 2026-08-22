import { Component, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import {
  editIcon,
  magicIcon,
  shareIcon,
  statsIcon,
  translatePageIcon
} from '../../../../icon-registry'
import { ModalService } from '../../../../services/modal-service'
import { LearnablesStore } from '../../../../store/learnables-store'
import { ConfirmationType } from '../../../shared/forms/bulk-add-comp/bulk-edit-comp'

type QuickLinkType = 'create' | 'community' | 'generate' | 'translate' | 'stats'

@Component({
  selector: 'liz-quick-links',
  imports: [RouterLink, NgIcon],
  templateUrl: './quick-links.html',
  styleUrl: './quick-links.scss'
})
export class QuickLinks {
  protected readonly icons = {
    editIcon,
    magicIcon,
    shareIcon,
    statsIcon,
    translatePageIcon
  }
  readonly types = input.required<QuickLinkType[]>()
  readonly ls = inject(LearnablesStore)
  readonly modalService = inject(ModalService)

  async createCards() {
    const result = await this.modalService.open<ConfirmationType>('bulk-edit')
    if (result.type !== 'confirm') return
    this.ls.importCards(result.value.add)
  }
}
