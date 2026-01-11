import { DOCUMENT, inject, Injectable } from '@angular/core'
import { BankShareBase, BankShareConfig, BankUser } from '@shared/types'
import { config } from '../../config'
import {
  mapBankToShareable,
  parseFileImportString,
  verifiyImportedFileValidity
} from '../utils/import-export-utils'
import { ApiService } from './api-service'
import { ModalService } from './modal-service'
import { ToastService } from './toast-service'

@Injectable({
  providedIn: 'root'
})
export class ShareBanksService {
  private readonly toastService = inject(ToastService)
  private readonly modalService = inject(ModalService)
  private apiService = inject(ApiService)
  private _blobUrl = ''
  private readonly document = inject(DOCUMENT)

  // use service for this to handle revoking last blob for better memory management
  downloadBank(bank: BankUser, onlyForCollectionIds?: string[]): void {
    const bankExport = mapBankToShareable(bank, onlyForCollectionIds)

    URL.revokeObjectURL(this._blobUrl)

    const jsonString = JSON.stringify(bankExport)

    // use application/octet-stream to force download as *.suffix and not as *.suffix.json in browsers
    const blob = new Blob([jsonString], { type: 'application/octet-stream' })
    const blobUrl = URL.createObjectURL(blob)

    const fileName = `${config.fileExportName} - ${bank.name} - ${new Date().toDateString()}.${
      config.fileExportSuffix
    }`

    this._blobUrl = blobUrl

    // create click and remove download link element
    const anchor = this.document.createElement('a')
    anchor.href = blobUrl
    anchor.download = fileName
    anchor.click()
    anchor.remove()
  }

  async readFile(file: File): Promise<BankShareBase> {
    // Verify file validity first
    verifiyImportedFileValidity(file)

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string
          const imported = parseFileImportString(content)
          if (imported.learnables.length === 0) throw new Error('File contains no learnables')

          resolve(imported)
        } catch (error) {
          reject(error)
        }
      }

      fileReader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      fileReader.readAsText(file)
    })
  }

  async copyLinkToClipboard(bankId: string, bankName: string): Promise<void> {
    try {
      const url = new URL(this.document.location.origin)
      url.searchParams.set(config.bankIDParamName, bankId)

      await navigator.clipboard.writeText(url.toString())
      this.toastService.showToast({
        header: bankName,
        message: `Link copied to clipboard`,
        type: 'info'
      })
    } catch {
      this.toastService.showToast({ message: 'Failed to copy bank ID to clipboard', type: 'error' })
    }
  }

  async shareBank(bank: BankUser, onlyForCollectionIds?: string[]): Promise<void> {
    const result = await this.modalService.open<BankShareConfig>('bank-share', { bank })
    if (result.type !== 'confirm') return
    const mappedBank = mapBankToShareable(bank, onlyForCollectionIds)

    try {
      const response = await this.apiService.shareBank({ bank: mappedBank, config: result.value })
      this.toastService.showToast({
        header: 'Success',
        message: `Check Community page to see.`,
        type: 'info'
      })
      await this.copyLinkToClipboard(response.id, bank.name)
    } catch {
      this.toastService.showToast({
        header: 'Error',
        message: 'Failed to share bank.',
        type: 'error'
      })
    }
  }
}
