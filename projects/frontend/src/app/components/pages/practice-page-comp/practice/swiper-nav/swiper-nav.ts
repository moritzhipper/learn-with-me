import { Component, output, signal } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { collapseIcon } from '../../../../../icon-registry'

@Component({
  selector: 'liz-swiper-nav',
  imports: [NgIcon],
  templateUrl: './swiper-nav.html',
  styleUrl: './swiper-nav.scss'
})
export class SwiperNav {
  protected collapseIcon = collapseIcon
  isOpen = signal(false)
  giveUp = output<void>()
  edit = output<void>()
}
