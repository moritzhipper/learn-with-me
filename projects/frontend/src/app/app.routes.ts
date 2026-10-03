import { Routes } from '@angular/router'
import { Onboarding } from './components/onboarding/onboarding/onboarding'
import { AboutPageComp } from './components/pages/about-page-comp/about-page-comp'
import { CardsPage } from './components/pages/cards-page/cards-page'
import { UserCollectionPage } from './components/pages/cards-page/user-collection-page/user-collection-page'
import { DashboardPage } from './components/pages/dashboard-page/dashboard-page'
import { PracticeComp } from './components/pages/practice-page-comp/practice-page-comp'
import { SettingsComp } from './components/pages/settings-page-comp/settings-page-comp'
import { StatsPage } from './components/pages/stats-page/stats-page'
import { hasCardsGuard } from './guards/has-cards-guard'
import { isNewUserGuard } from './guards/is-new-user-guard'

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    title: 'LingoLizard | Dashboard',
    canActivate: [isNewUserGuard]
  },
  {
    path: 'onboarding',
    title: 'LingoLizard | Hi',
    component: Onboarding
  },
  {
    path: 'about',
    title: 'LinogLizard | Hi',
    component: AboutPageComp
  },
  {
    path: '',
    title: 'LingoLizard',
    canActivate: [hasCardsGuard, isNewUserGuard],
    canActivateChild: [hasCardsGuard, isNewUserGuard],
    children: [
      {
        component: CardsPage,
        path: 'cards'
      },
      {
        path: 'cards:id',
        component: UserCollectionPage
      },
      {
        component: PracticeComp,
        path: 'practice',
        title: 'lingolizard | Practice'
      },
      {
        component: StatsPage,
        title: 'lingolizard | Statis',
        path: 'stats'
      },
      {
        component: SettingsComp,
        path: 'settings',
        title: 'lingolizard | Settings'
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
              import('./components/pages/share-page-comp/share-page-comp').then(
                (m) => m.SharePageComp
              )
          },
          {
            path: 'explore',
            loadComponent: () =>
              import('./components/pages/share-page-comp/explore-page-comp/explore-page-comp').then(
                (m) => m.ExplorePageComp
              )
          },
          {
            path: 'bank/:id',
            loadComponent: () =>
              import('./components/pages/share-page-comp/shared-collection-page/shared-bank-page').then(
                (m) => m.SharedBankPage
              )
          }
        ]
      }
    ]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
]
