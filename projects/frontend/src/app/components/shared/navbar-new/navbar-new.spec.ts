import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NavbarNew } from './navbar-new'

describe('NavbarNewComp', () => {
  let component: NavbarNew
  let fixture: ComponentFixture<NavbarNew>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarNew]
    }).compileComponents()

    fixture = TestBed.createComponent(NavbarNew)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
