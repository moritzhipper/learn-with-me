import { Routes } from '@angular/router'
import { CardsPage } from './components/pages/cards-page/cards-page'
import { UserCollectionPage } from './components/pages/cards-page/user-collection-page/user-collection-page'
import { DashboardPage } from './components/pages/dashboard-page/dashboard-page'
import { PracticeComp } from './components/pages/practice-page-comp/practice-page-comp'
import { SettingsComp } from './components/pages/settings-page-comp/settings-page-comp'
import { StatsPage } from './components/pages/stats-page/stats-page'
import { hasCardsGuard } from './guards/has-cards-guard'
import { modalOpenGuard } from './guards/modal-open-guard'

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    title: 'LingoLizard | Dashboard',
    canActivate: [modalOpenGuard]
  },
  {
    path: 'cards',
    title: 'LingoLizard | Cards',
    canActivate: [hasCardsGuard],
    children: [
      {
        component: CardsPage,
        path: ''
      },
      {
        path: ':id',
        component: UserCollectionPage
      }
    ]
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
      },
      {
        path: 'bank/:id',
        loadComponent: () =>
          import('./components/pages/share-page-comp/shared-collection-page/shared-bank-page').then(
            (m) => m.SharedBankPage
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
