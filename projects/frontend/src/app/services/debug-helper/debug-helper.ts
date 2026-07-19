import { inject, Injectable } from '@angular/core'
import { BankUser, LanguageConfig } from '@shared/types'
import { BankImportOptions } from '../../components/shared/forms/import-form-comp/import-form-comp'
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

    const result = await this.ms.open<BankImportOptions>('bank-import', {
      bank,
      activeBankLanguage: activeBankLang
    })

    if (result.type !== 'confirm') return

    if (result.value.strategy === 'new') {
      this.ls.importBankAsNew(bank, result.value.invertLanguageDirection)
    } else {
      const mergeResult = this.ls.mergeBankIntoActive(bank, result.value.invertLanguageDirection)
      console.log('merge result', mergeResult)
    }
  }

  async triggerExportBankForm() {
    this.ms.open('export-bank-local')
  }
}
