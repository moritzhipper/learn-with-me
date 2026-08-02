import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserCollectionHeader } from './user-collection-header'

describe('UserCollectionHeader', () => {
  let component: UserCollectionHeader
  let fixture: ComponentFixture<UserCollectionHeader>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCollectionHeader]
    }).compileComponents()

    fixture = TestBed.createComponent(UserCollectionHeader)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
