import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { MagicTranslate } from './magic-translate/magic-translate'
import { QuickTranslate } from './quick-translate/quick-translate'

@Component({
  selector: 'app-translate-page-comp',
  imports: [PageIconComp, FormsModule, IconComp, QuickTranslate, MagicTranslate],
  templateUrl: './translate-page-comp.html',
  styleUrl: './translate-page-comp.scss',
  host: { class: 'page mid' }
})
export class TranslatePageComp {
  selectedMode = signal<'quick' | 'magic'>('quick')

  private readonly ls = inject(LearnablesStore)

  protected setTone(tone: string) {
    this.ls.updateTranslateTone(tone)
  }

  protected toggleMode() {
    this.selectedMode.update((v) => (v === 'quick' ? 'magic' : 'quick'))
  }
}
