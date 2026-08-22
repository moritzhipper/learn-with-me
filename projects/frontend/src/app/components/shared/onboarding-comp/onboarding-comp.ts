import { Component, inject, signal } from '@angular/core'
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { NgIcon } from '@ng-icons/core'
import { BankBase, LanguageConfig } from '@shared/types'
import { AnimDelayWrapper } from '../../../directives/anim-delay-wrapper'
import { collapseIcon, favoriteIcon, infoIcon, magicIcon } from '../../../icon-registry'
import { LearnablesStore } from '../../../store/learnables-store'
import { SettingsStore } from '../../../store/settings-store'
import { LarryBig } from '../larries/larry-big/larry-big'

@Component({
  selector: 'app-onboarding-comp',
  imports: [NgIcon, FormsModule, ReactiveFormsModule, LarryBig, AnimDelayWrapper],
  templateUrl: './onboarding-comp.html',
  styleUrl: './onboarding-comp.scss'
})
export class OnboardingComp {
  protected readonly icons = {
    aboutPageIcon: infoIcon,
    collapseIcon,
    favoriteIcon,
    magicIcon
  }
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
