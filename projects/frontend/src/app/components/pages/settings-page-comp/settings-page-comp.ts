import { Component, computed, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { NgIcon } from '@ng-icons/core'
import { BankBase, BankUser } from '@shared/types'
import { environment } from '../../../../environments/environment'
import { addIcon, settingsPageIcon } from '../../../icon-registry'
import { DebugHelper } from '../../../services/debug-helper/debug-helper'
import { ModalService } from '../../../services/modal-service'
import { ShareBanksService } from '../../../services/share-banks-service'
import { ToastOptions, ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnables-store'
import { SettingsStore } from '../../../store/settings-store'
import { BankSettingsComp } from '../../shared/banks-and-collections/bank-settings-comp/bank-settings-comp'
import { CardsStack } from '../../shared/banks-and-collections/cards-stack/cards-stack'
import { ExportBankLocalFormResult } from '../../shared/forms/export-bank-local-form/export-bank-local-form'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageWrapper } from '../page-wrapper/page-wrapper'
import { SettingsItemComp } from './settings-item-comp/settings-item-comp'

@Component({
  selector: 'app-settings-comp',
  imports: [
    ReactiveFormsModule,
    BankSettingsComp,
    PageHeaderComp,
    SettingsItemComp,
    PageWrapper,
    CardsStack,
    NgIcon
  ],
  templateUrl: './settings-page-comp.html',
  styleUrl: './settings-page-comp.scss'
})
export class SettingsComp {
  private readonly _settingsS = inject(SettingsStore)
  private readonly ls = inject(LearnablesStore)
  private readonly _modalService = inject(ModalService)
  private readonly _toastS = inject(ToastService)
  private readonly _sharedBankS = inject(ShareBanksService)
  private readonly debugHelper = inject(DebugHelper)

  protected readonly icons = {
    settingsPageIcon,
    addIcon
  }

  protected isProduction = environment.isProd

  protected tokensUsed = this._settingsS.tokensUsed
  protected apiKey = this._settingsS.apiKey

  protected banks = this.ls.banks
  protected activeBankId = computed(() => this.ls.activeBank().id)

  triggerImportBankForm = this.debugHelper.triggerImportBankForm.bind(this.debugHelper)
  triggerExportBankForm = () => this.debugHelper.triggerExportBankForm()
  triggerToast(type: ToastOptions['type'], hasHeader = false) {
    if (hasHeader) {
      this.debugHelper.triggerToast({
        message: 'This is a toast with a header.',
        type,
        header: 'Header'
      })
    } else {
      this.debugHelper.triggerToast({
        message: 'This is a toast without a header.',
        type
      })
    }
  }

  async reset() {
    const result = await this._modalService.open('confirm', {
      message: 'Reset everything',
      warning: `All cards, banks, collections and cards will be removed from your device.`,
      label: 'Yup, do it!'
    })

    if (result.type !== 'confirm') return
    this.ls.reset()
    this._settingsS.reset()
  }

  async createNewBank() {
    const result = await this._modalService.open<BankBase>('edit-bank')
    if (result.type !== 'confirm') return

    const id = this.ls.createBank(result.value)
    this.setActiveBank(id)
  }

  setActiveBank(id: string) {
    this.ls.setActiveBank(id)
  }

  async editBank(bank: BankUser) {
    const result = await this._modalService.open<BankBase>('edit-bank', {
      preset: bank
    })
    if (result.type !== 'confirm') return

    this.ls.updateBank(result.value, bank.id)
  }

  async shareBank(bank: BankUser) {
    const result = await this._sharedBankS.shareBank(bank)
  }

  async deleteBank(id: string) {
    const result = await this._modalService.open('confirm', {
      message: `Delete this Bank?`
    })

    if (result.type !== 'confirm') return

    try {
      this.ls.deleteBank(id)
    } catch (error) {
      this._toastS.showToast({
        message: (error as Error).message || 'Failed to delete Bank.',
        type: 'error'
      })
    }
  }

  async downloadBank(bank: BankUser) {
    const result = await this._modalService.open<ExportBankLocalFormResult>('export-bank-local')
    if (result.type !== 'confirm') return

    this._sharedBankS.saveBankToDevice(bank, result.value)
  }

  protected updateKey(event: Event) {
    const input = event.target as HTMLInputElement
    this._settingsS.updateSettings({ apiKey: input.value })
  }
}
