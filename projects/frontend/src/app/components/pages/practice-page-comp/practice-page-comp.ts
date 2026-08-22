import { Component, computed, inject } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { remixBug2Fill } from '@ng-icons/remixicon'
import { LearnablesStore } from '../../../store/learnables-store'
import { PageWrapper } from '../page-wrapper/page-wrapper'
import { ActivePracticeComp } from './active-practice-comp/active-practice-comp'
import { ConfigurePracticeComp } from './configure-practice-comp/configure-practice-comp'

@Component({
  selector: 'app-practice',
  imports: [ActivePracticeComp, ConfigurePracticeComp, PageWrapper],
  providers: [
    provideIcons({
      remixBug2Fill
    })
  ],
  templateUrl: './practice-page-comp.html',
  styleUrl: './practice-page-comp.scss'
})
export class PracticeComp {
  protected readonly ls = inject(LearnablesStore)
  currentPractice = computed(() => this.ls.activeBank().practice.active)

  iconBug = remixBug2Fill
}
