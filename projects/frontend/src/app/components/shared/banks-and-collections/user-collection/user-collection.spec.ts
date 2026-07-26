import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserCollection } from './user-collection'

describe('UserCollection', () => {
  let component: UserCollection
  let fixture: ComponentFixture<UserCollection>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCollection]
    }).compileComponents()

    fixture = TestBed.createComponent(UserCollection)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
