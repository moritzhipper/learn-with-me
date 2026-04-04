import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTranslate } from './quick-translate';

describe('QuickTranslate', () => {
  let component: QuickTranslate;
  let fixture: ComponentFixture<QuickTranslate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickTranslate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickTranslate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
