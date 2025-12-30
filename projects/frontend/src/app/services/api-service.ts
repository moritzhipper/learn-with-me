import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { API_ROUTES } from '@shared/api-routes'
import { BankShare, BanksRequest } from '@shared/types'
import { lastValueFrom, Observable, take } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = '/api'

  private readonly _client = inject(HttpClient)

  getBanks(conf: BanksRequest): Observable<BankShare[]> {
    return this._client.get<BankShare[]>(`${this.BASE_URL}${API_ROUTES.BANKS.ROOT}`, {
      params: conf
    })
  }

  async shareBank(bankExport: Omit<BankShare, 'expires'>, ttlMinutes: number) {
    const response = this._client.post<BankShare>(`${this.BASE_URL}${API_ROUTES.BANKS.SHARE}`, {
      bankExport,
      ttlMinutes
    })

    return this._toPromise(response)
  }

  private _toPromise<T>(obs: Observable<T>): Promise<T> {
    return lastValueFrom(obs.pipe(take(1)))
  }
}
