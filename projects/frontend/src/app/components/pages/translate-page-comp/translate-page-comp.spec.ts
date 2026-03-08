import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePageComp } from './translate-page-comp';

describe('TranslatePageComp', () => {
  let component: TranslatePageComp;
  let fixture: ComponentFixture<TranslatePageComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePageComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslatePageComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
