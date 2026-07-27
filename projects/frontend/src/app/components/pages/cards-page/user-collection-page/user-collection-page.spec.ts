import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserCollectionPage } from './user-collection-page'

describe('UserCollectionPage', () => {
  let component: UserCollectionPage
  let fixture: ComponentFixture<UserCollectionPage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCollectionPage]
    }).compileComponents()

    fixture = TestBed.createComponent(UserCollectionPage)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
