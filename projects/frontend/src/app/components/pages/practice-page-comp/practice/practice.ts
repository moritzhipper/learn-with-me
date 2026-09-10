import { Component } from '@angular/core'
import { SwiperNav } from './swiper-nav/swiper-nav'
import { Swiper } from './swiper/swiper'

@Component({
  selector: 'liz-practice',
  imports: [Swiper, SwiperNav],
  templateUrl: './practice.html',
  styleUrl: './practice.scss'
})
export class Practice {}
