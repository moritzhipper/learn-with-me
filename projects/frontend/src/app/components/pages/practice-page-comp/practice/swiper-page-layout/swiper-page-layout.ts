import { Component } from '@angular/core'

@Component({
  selector: 'liz-swiper-page-layout, [liz-swiper-page-layout]',
  imports: [],
  template: `
    <div class="top">
      <ng-content select="[swiper-top]" />
    </div>
    <div class="nav">
      <ng-content select="[swiper-navigation]" />
    </div>

    <div class="full">
      <ng-content select="[swiper-full]" />
    </div>
  `,
  styleUrl: './swiper-page-layout.scss'
})
export class SwiperPageLayout {}
