import { DOCUMENT, inject, Injectable } from '@angular/core'
import { BankShare, BankUser } from '@shared/types'
import { config } from '../../config'
import {
  mapToBankExport,
  parseFileImportString,
  verifiyImportedFileValidity
} from '../utils/import-export-utils'
import { ToastService } from './toast-service'

@Injectable({
  providedIn: 'root'
})
export class ShareBanksService {
  private readonly toastService = inject(ToastService)
  private _blobUrl = ''
  private readonly document = inject(DOCUMENT)

  // use service for this to handle revoking last blob for better memory management
  downloadBank(bank: BankUser, onlyForCollectionIds?: string[]): void {
    const bankExport = mapToBankExport(bank, onlyForCollectionIds)

    URL.revokeObjectURL(this._blobUrl)

    const jsonString = JSON.stringify(bankExport)

    // use application/octet-stream to force download as *.suffix and not as *.suffix.json in browsers
    const blob = new Blob([jsonString], { type: 'application/octet-stream' })
    const blobUrl = URL.createObjectURL(blob)

    const fileName = `${config.fileExportName} - ${bank.name} - ${new Date().toDateString()}.${
      config.fileExportSuffix
    }`

    this._blobUrl = blobUrl

    const anchor = this.document.createElement('a')
    anchor.href = blobUrl
    anchor.download = fileName
    anchor.click()
    anchor.remove()
  }

  async readFile(file: File): Promise<BankShare> {
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

  async copyLinkToClipboard({ id, name }: BankShare): Promise<void> {
    try {
      await navigator.clipboard.writeText(id)
      this.toastService.showToast({
        header: name,
        message: `Link copied to clipboard`,
        type: 'info'
      })
    } catch {
      this.toastService.showToast({ message: 'Failed to copy bank ID to clipboard', type: 'error' })
    }
  }
}
