import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LanguageMatch } from './language-match'

describe('LanguageMatch', () => {
  let component: LanguageMatch
  let fixture: ComponentFixture<LanguageMatch>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageMatch]
    }).compileComponents()

    fixture = TestBed.createComponent(LanguageMatch)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
