import { Component, computed, inject, signal } from '@angular/core'
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
  magicPreset = signal<string>('')

  private readonly ls = inject(LearnablesStore)
  protected readonly tone = computed(() => this.ls.activeBank().translations.tone)

  protected setTone(tone: string) {
    this.ls.updateTranslateTone(tone)
  }

  protected toggleMode() {
    this.magicPreset.set('')
    this.selectedMode.update((v) => (v === 'quick' ? 'magic' : 'quick'))
  }

  openInMagicMode(text: string) {
    this.magicPreset.set(text)
    this.selectedMode.set('magic')
  }
}
