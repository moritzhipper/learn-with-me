import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { API_ROUTES } from '@shared/api-routes'
import { BankShareRequest, BankShareViaDB, BanksRequest, ObjectWithId } from '@shared/types'
import { lastValueFrom, Observable, take } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = '/api'

  private readonly _client = inject(HttpClient)

  getCommunityBanks(conf: BanksRequest): Observable<BankShareViaDB[]> {
    return this._client.get<BankShareViaDB[]>(`${this.BASE_URL}${API_ROUTES.BANKS.ROOT}`, {
      params: conf
    })
  }

  getUserBanks() {
    return this._client.get<BankShareViaDB[]>(`${this.BASE_URL}${API_ROUTES.BANKS.USER}`)
  }

  getBankByID(id: string): Observable<BankShareViaDB> {
    return this._client.get<BankShareViaDB>(`${this.BASE_URL}${API_ROUTES.BANKS.ROOT}/${id}`)
  }

  async increaseBankDownloadCount(id: string): Promise<void> {
    const response = this._client.post<void>(`${this.BASE_URL}${API_ROUTES.BANKS.SHARE}/${id}`, {})

    // dont await, but wrap in promise
    try {
      await this._toPromise(response)
    } catch (e) {
      console.error('Failed to increase bank download count', e)
    }

    return
  }

  async shareBank(shareConfig: BankShareRequest): Promise<ObjectWithId> {
    const response = this._client.post<ObjectWithId>(
      `${this.BASE_URL}${API_ROUTES.BANKS.SHARE}`,
      shareConfig
    )

    return this._toPromise(response)
  }

  private _toPromise<T>(obs: Observable<T>): Promise<T> {
    return lastValueFrom(obs.pipe(take(1)))
  }
}
