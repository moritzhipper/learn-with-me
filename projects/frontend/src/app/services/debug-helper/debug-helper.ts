import { inject, Injectable } from '@angular/core'
import { BankUser, LanguageConfig } from '@shared/types'
import { LearnablesStore } from '../../store/learnables-store'
import { mapBankToExportable } from '../../utils/import-export-utils'
import { ModalService } from '../modal-service'
import { buildDebugBank } from './debug-utils'

const langConfig1: LanguageConfig = {
  speaking: 'German',
  learning: 'Dutch'
}

const langConfig1Inverted: LanguageConfig = {
  speaking: 'Dutch',
  learning: 'German'
}

const langConfig2: LanguageConfig = {
  speaking: 'Niederländisch',
  learning: 'German'
}

@Injectable({
  providedIn: 'root'
})
export class DebugHelper {
  private readonly ls = inject(LearnablesStore)
  private readonly ms = inject(ModalService)

  addDebugBank() {
    this.ls.importBank(buildDebugBank())
  }

  async triggerImportBankForm(
    type: 'single' | 'multiple',
    importLang: 'match' | 'invert-match' | 'no-match' = 'match'
  ) {
    const importBankLang =
      importLang === 'match'
        ? langConfig1
        : importLang === 'invert-match'
          ? langConfig1Inverted
          : langConfig2

    const userBank: BankUser = {
      ...buildDebugBank(),
      language: importBankLang
    }

    const firstCollectionID = userBank.collections[0].id
    const bank =
      type === 'single'
        ? mapBankToExportable(userBank, { onlyForCollectionIds: [firstCollectionID] })
        : mapBankToExportable(userBank)

    const activeBankLang: LanguageConfig = {
      speaking: 'German',
      learning: 'Dutch'
    }

    this.ms.open('bank-import', {
      bank,
      activeBankLanguage: activeBankLang
    })
  }
  async triggerExportBankForm() {
    this.ms.open('export-bank-local')
  }
}
