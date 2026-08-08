import { Component, inject, signal } from '@angular/core'
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { BankBase, LanguageConfig } from '@shared/types'
import { AnimDelay } from '../../../directives/anim-delay'
import { LearnablesStore } from '../../../store/learnables-store'
import { SettingsStore } from '../../../store/settings-store'
import { IconComp } from '../icon-comp/icon-comp'
import { LarryBig } from '../larries/larry-big/larry-big'

@Component({
  selector: 'app-onboarding-comp',
  imports: [IconComp, FormsModule, ReactiveFormsModule, LarryBig, AnimDelay],
  templateUrl: './onboarding-comp.html',
  styleUrl: './onboarding-comp.scss'
})
export class OnboardingComp {
  protected readonly activeIndex = signal(0)
  private readonly _settings = inject(SettingsStore)
  private readonly ls = inject(LearnablesStore)

  protected apiKey = this._settings.apiKey

  protected readonly _fb = inject(NonNullableFormBuilder)

  languageForm = this._fb.group({
    learning: ['', Validators.required],
    speaking: ['', Validators.required]
  })

  next() {
    if (this.activeIndex() < 3) {
      this.activeIndex.update((i) => i + 1)
    } else if (this.activeIndex() === 3 && this.languageForm.valid) {
      this.createFirstBank()
    }
  }

  back() {
    if (this.activeIndex() > 0) {
      this.activeIndex.update((i) => i - 1)
    }
  }

  updateApiKey(apiKey: string) {
    this._settings.updateSettings({ apiKey })
  }

  createFirstBank() {
    const language = this.languageForm.value as LanguageConfig
    const bank: BankBase = {
      name: 'My First Language Bank',
      language
    }
    const id = this.ls.createBank(bank)
    this.ls.setActiveBank(id)
  }
}
