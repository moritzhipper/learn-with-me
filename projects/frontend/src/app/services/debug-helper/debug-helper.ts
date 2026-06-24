import { inject, Injectable } from '@angular/core'
import { LearnablesStore } from '../../store/learnables-store'
import { buildDebugBank } from './debug-utils'

@Injectable({
  providedIn: 'root'
})
export class DebugHelper {
  private readonly ls = inject(LearnablesStore)

  seedDebugBank() {
    const debugBank = this.ls.addBankForDebug(buildDebugBank())
  }
}
