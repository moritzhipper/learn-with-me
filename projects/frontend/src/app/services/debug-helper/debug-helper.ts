import { inject, Injectable } from '@angular/core'
import { LanguageConfig } from '@shared/types'
import { LearnablesStore } from '../../store/learnables-store'
import { mapBankToExportable } from '../../utils/import-export-utils'
import { ModalService } from '../modal-service'
import { buildDebugBank } from './debug-utils'

@Injectable({
  providedIn: 'root'
})
export class DebugHelper {
  private readonly ls = inject(LearnablesStore)
  private readonly ms = inject(ModalService)

  addDebugBank() {
    this.ls.importBank(buildDebugBank())
  }

  async triggerImportBankForm(type: 'single' | 'multiple') {
    const userBank = buildDebugBank()
    const firstCollectionID = userBank.collections[0].id

    const bank =
      type === 'single'
        ? mapBankToExportable(userBank, { onlyForCollectionIds: [firstCollectionID] })
        : mapBankToExportable(userBank)

    const lang: LanguageConfig = {
      speaking: 'German',
      learning: 'Dutch'
    }
    this.ms.open('bank-import', {
      bank,
      activeBankLanguage: lang
    })
  }
  async triggerExportBankForm() {
    this.ms.open('export-bank-local')
  }
}
