import { Routes } from '@angular/router'
import { DashboardPage } from './components/pages/dashboard-page/dashboard-page'
import { OverviewComp } from './components/pages/overview-page-comp/overview-page-comp'
import { PracticeComp } from './components/pages/practice-page-comp/practice-page-comp'
import { SettingsComp } from './components/pages/settings-page-comp/settings-page-comp'
import { StatsPage } from './components/pages/stats-page/stats-page'

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
    component: SettingsComp,
    path: 'settings',
    title: 'lingolizard | Settings'
  },
  {
    component: StatsPage,
    title: 'lingolizard | Statis',
    path: 'stats'
  },
  {
    loadComponent: () =>
      import('./components/pages/about-page-comp/about-page-comp').then((m) => m.AboutPageComp),
    path: 'about',
    title: 'lingolizard | About'
  },
  {
    loadComponent: () =>
      import('./components/pages/translate-page-comp/translate-page-comp').then(
        (m) => m.TranslatePageComp
      ),
    path: 'translate',
    title: 'lingolizard | Translate'
  },
  {
    path: 'community',
    title: 'lingolizard | Community',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/pages/share-page-comp/share-page-comp').then((m) => m.SharePageComp)
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./components/pages/share-page-comp/explore-page-comp/explore-page-comp').then(
            (m) => m.ExplorePageComp
          )
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'cards',
    pathMatch: 'full'
  }
]
