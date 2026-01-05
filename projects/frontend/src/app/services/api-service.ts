import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { API_ROUTES } from '@shared/api-routes'
import { BankShareBase, BankShareViaDB, BanksRequest } from '@shared/types'
import { lastValueFrom, Observable, take } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = '/api'

  private readonly _client = inject(HttpClient)

  getBanks(conf: BanksRequest): Observable<BankShareViaDB[]> {
    return this._client.get<BankShareViaDB[]>(`${this.BASE_URL}${API_ROUTES.BANKS.ROOT}`, {
      params: conf
    })
  }

  async shareBank(bankExport: Omit<BankShareBase, 'expires'>, ttlMinutes: number) {
    const response = this._client.post<BankShareBase>(`${this.BASE_URL}${API_ROUTES.BANKS.SHARE}`, {
      bankExport,
      ttlMinutes
    })

    return this._toPromise(response)
  }

  private _toPromise<T>(obs: Observable<T>): Promise<T> {
    return lastValueFrom(obs.pipe(take(1)))
  }
}
