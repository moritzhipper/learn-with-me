import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { API_ROUTES } from '@shared/api-routes'
import { BankShareBase, BankShareConfigParams, BankShareViaDB, BanksRequest } from '@shared/types'
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

  async shareBank(bank: BankShareBase, config: BankShareConfigParams) {
    const params = new HttpParams(config as any)

    const response = this._client.post<BankShareBase>(
      `${this.BASE_URL}${API_ROUTES.BANKS.SHARE}`,
      bank,
      {
        params
      }
    )

    return this._toPromise(response)
  }

  private _toPromise<T>(obs: Observable<T>): Promise<T> {
    return lastValueFrom(obs.pipe(take(1)))
  }
}
