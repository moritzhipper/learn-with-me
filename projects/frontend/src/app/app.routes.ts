import { Routes } from '@angular/router'
import { AboutPageComp } from './components/pages/about-page-comp/about-page-comp'
import { DashboardPage } from './components/pages/dashboard-page/dashboard-page'
import { OverviewComp } from './components/pages/overview-page-comp/overview-page-comp'
import { PracticeComp } from './components/pages/practice-page-comp/practice-page-comp'
import { SettingsComp } from './components/pages/settings-page-comp/settings-page-comp'
import { ExplorePageComp } from './components/pages/share-page-comp/explore-page-comp/explore-page-comp'
import { SharePageComp } from './components/pages/share-page-comp/share-page-comp'
import { StatsPage } from './components/pages/stats-page/stats-page'
import { TranslatePageComp } from './components/pages/translate-page-comp/translate-page-comp'

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    title: 'LingoLizard | Dashboard'
  },
  {
    component: OverviewComp,
    path: 'cards',
    title: 'LingoLizard | Cards'
  },
  {
    component: PracticeComp,
    path: 'practice',
    title: 'lingolizard | Practice'
  },
  {
    component: TranslatePageComp,
    path: 'translate',
    title: 'lingolizard | Translate'
  },
  {
    path: 'community',
    title: 'lingolizard | Community',
    children: [
      { path: '', component: SharePageComp },
      { path: 'explore', component: ExplorePageComp }
    ]
  },
  {
    component: StatsPage,
    title: 'lingolizard | Statis',
    path: 'stats'
  },
  {
    component: AboutPageComp,
    path: 'about',
    title: 'lingolizard | About'
  },
  {
    component: SettingsComp,
    path: 'settings',
    title: 'lingolizard | Settings'
  },
  {
    path: '**',
    redirectTo: 'cards',
    pathMatch: 'full'
  }
]
