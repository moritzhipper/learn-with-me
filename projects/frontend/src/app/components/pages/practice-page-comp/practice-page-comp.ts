import { Component, computed, inject } from '@angular/core'
import { Practice } from '@shared/types'
import { LearnablesStore } from '../../../store/learnablesStore'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { ActivePracticeComp } from './active-practice-comp/active-practice-comp'
import { ConfigurePracticeComp } from './configure-practice-comp/configure-practice-comp'

@Component({
  selector: 'app-practice',
  imports: [ActivePracticeComp, ConfigurePracticeComp, PageIconComp],
  templateUrl: './practice-page-comp.html',
  styleUrl: './practice-page-comp.scss',
  host: { class: 'page full' }
})
export class PracticeComp {
  protected readonly ls = inject(LearnablesStore)
  currentPractice = computed(() => this.ls.activeBank().practice.current)

  protected isFinished(prac: Practice): boolean {
    return prac.guessableIndex >= prac.guessables.length
  }

  protected isUnfinished(prac: Practice): boolean {
    return prac.guessableIndex < prac.guessables.length
  }
}
