import { Component, inject, signal } from '@angular/core'
import { form, FormField, required } from '@angular/forms/signals'
import { Router } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { LanguageConfig } from '@shared/types'
import { AnimDelayWrapper } from '../../../directives/anim-delay-wrapper'
import { learnLanguageIcon, speakLanguageIcon } from '../../../icon-registry'
import { LearnablesStore } from '../../../store/learnables-store'
import { SettingsStore } from '../../../store/settings-store'
import { SwiperPageLayout } from '../../pages/practice-page-comp/practice/swiper-page-layout/swiper-page-layout'
import { OnboardingNav } from '../onboarding-nav/onboarding-nav'

@Component({
  selector: 'liz-onboarding-clean',
  imports: [SwiperPageLayout, OnboardingNav, NgIcon, AnimDelayWrapper, FormField],
  templateUrl: './onboarding-clean.html',
  styleUrl: './onboarding-clean.scss'
})
export class OnboardingClean {
  private readonly router = inject(Router)
  private readonly ls = inject(LearnablesStore)
  private readonly settingsS = inject(SettingsStore)

  protected readonly icons = {
    speakLanguageIcon,
    learnLanguageIcon
  }

  protected languageModel = signal<LanguageConfig>({
    speaking: '',
    learning: ''
  })

  protected languageForm = form(this.languageModel, (schema) => {
    required(schema.learning)
    required(schema.speaking)
  })

  protected goToDashboard() {
    if (this.languageForm().invalid()) return

    this.settingsS.updateSettings({ userID: crypto.randomUUID() })

    const language = this.languageForm().controlValue()
    const newBankId = this.ls.createBank({ language, name: 'First Bank' })
    this.ls.setActiveBank(newBankId)

    this.router.navigate([''])
  }
}
