import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguageMatchComp } from './select-language-match-comp';

describe('SelectLanguageMatchComp', () => {
  let component: SelectLanguageMatchComp;
  let fixture: ComponentFixture<SelectLanguageMatchComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLanguageMatchComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLanguageMatchComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
