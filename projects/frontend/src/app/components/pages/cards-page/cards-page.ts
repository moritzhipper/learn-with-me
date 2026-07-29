import { Component } from '@angular/core'
import { CardsQuickSelector } from '../../shared/banks-and-collections/cards-quick-selector/cards-quick-selector'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageWrapper } from '../page-wrapper/page-wrapper'

@Component({
  selector: 'liz-cards-page',
  imports: [PageWrapper, PageHeaderComp, CardsQuickSelector],
  templateUrl: './cards-page.html',
  styleUrl: './cards-page.scss'
})
export class CardsPage {}
