import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SharedCollectionPage } from './shared-collection-page'

describe('SharedCollectionPage', () => {
  let component: SharedCollectionPage
  let fixture: ComponentFixture<SharedCollectionPage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCollectionPage]
    }).compileComponents()

    fixture = TestBed.createComponent(SharedCollectionPage)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
